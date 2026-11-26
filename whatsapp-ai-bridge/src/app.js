// HTTP handler: Meta webhook verification + incoming messages -> AI -> WhatsApp reply.
import { extractMessages, verifySignature } from './whatsapp.js';
import { ConversationStore, Deduper, KeyedQueue, RateLimiter } from './state.js';
import { toWhatsAppFormat } from './text.js';

const MAX_BODY_BYTES = 1024 * 1024;
const RESET_COMMANDS = new Set(['/reset', 'reset', '/new', 'new chat']);

export function createApp({ config, agent, whatsapp, mcpEnabled = false }) {
  const store = new ConversationStore({ maxMessages: config.limits.historyMessages, ttlMs: config.limits.historyTtlMs });
  const deduper = new Deduper();
  const limiter = new RateLimiter({ limit: config.limits.rateLimit, windowMs: config.limits.rateWindowMs });
  const queue = new KeyedQueue();
  const pending = new Set(); // lets tests (and shutdown) wait for in-flight work

  async function handleIncoming(msg) {
    if (!msg.id || !msg.from || !deduper.firstTime(msg.id)) return;

    const allowed = config.whatsapp.allowedNumbers;
    if (allowed.length && !allowed.includes(msg.from)) {
      console.log(`[app] ignoring ${msg.from} (not in WHATSAPP_ALLOWED_NUMBERS)`);
      return;
    }

    const rate = limiter.check(msg.from);
    if (!rate.allowed) {
      if (rate.firstBlocked) {
        await whatsapp.sendText(msg.from, 'You are sending messages very quickly. Please wait a few minutes and try again.');
      }
      return;
    }

    await queue.run(msg.from, async () => {
      await whatsapp.markReadAndTyping(msg.id);

      if (!msg.text) {
        await whatsapp.sendText(msg.from, 'Sorry, I can only read text messages for now. Please type your question.');
        return;
      }

      const text = msg.text.trim();
      if (RESET_COMMANDS.has(text.toLowerCase())) {
        store.reset(msg.from);
        await whatsapp.sendText(msg.from, 'Done, I started a new conversation. How can I help?');
        return;
      }

      console.log(`[app] <- ${msg.from}: ${text.slice(0, 120)}`);
      let reply;
      const attachments = [];
      try {
        reply = await agent.reply({
          history: store.get(msg.from),
          userText: text,
          userId: msg.from,
          userName: msg.name,
          attachments,
        });
        store.append(msg.from, { role: 'user', content: text }, { role: 'assistant', content: reply });
      } catch (err) {
        console.error('[app] AI failed:', err.message);
        reply = config.ai.errorMessage;
      }
      await whatsapp.sendText(msg.from, toWhatsAppFormat(reply));
      console.log(`[app] -> ${msg.from}: ${reply.slice(0, 120)}`);

      // Files a tool produced (e.g. a PDF statement) go out as WhatsApp documents after the text.
      for (const file of attachments) {
        try {
          await whatsapp.sendDocument(msg.from, file);
          console.log(`[app] -> ${msg.from}: document ${file.name} (${file.data.length} bytes)`);
        } catch (err) {
          console.error(`[app] could not send ${file.name}:`, err.message);
          await whatsapp.sendText(msg.from, 'Sorry, I could not send the file just now. Please try again in a minute.');
        }
      }
    });
  }

  function track(promise) {
    const p = promise.catch((err) => console.error('[app] failed to handle message:', err.message));
    pending.add(p);
    p.finally(() => pending.delete(p));
  }

  async function handler(req, res) {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, JSON.stringify({ ok: true, mcp: mcpEnabled }), 'application/json');
    }

    if (url.pathname !== '/webhook') return send(res, 404, 'Not found');

    // Meta calls this once when you save the webhook URL in the dashboard.
    if (req.method === 'GET') {
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge') ?? '';
      if (mode === 'subscribe' && token && token === config.whatsapp.verifyToken) return send(res, 200, challenge);
      return send(res, 403, 'Verification failed');
    }

    if (req.method !== 'POST') return send(res, 405, 'Method not allowed');

    let raw;
    try {
      raw = await readBody(req);
    } catch {
      return send(res, 413, 'Payload too large');
    }
    if (!verifySignature(raw, req.headers['x-hub-signature-256'], config.whatsapp.appSecret)) {
      return send(res, 401, 'Invalid signature');
    }
    let payload;
    try {
      payload = JSON.parse(raw.toString('utf8'));
    } catch {
      return send(res, 400, 'Invalid JSON');
    }

    // Answer Meta immediately (it retries if we are slow), then do the AI work in the background.
    send(res, 200, 'OK');
    for (const msg of extractMessages(payload)) track(handleIncoming(msg));
  }

  return {
    handler,
    handleIncoming,
    /** Resolves when every message received so far has been answered. */
    async idle() {
      while (pending.size) await Promise.allSettled([...pending]);
    },
  };
}

function send(res, status, body, type = 'text/plain') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('too large'));
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
