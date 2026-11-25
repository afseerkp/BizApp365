// End to end: real HTTP server + real demo MCP server (stdio), with OpenRouter and WhatsApp replaced by fakes.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createMcp } from '../src/mcp.js';
import { createAgent } from '../src/ai.js';
import { createApp } from '../src/app.js';

const demoServer = fileURLToPath(new URL('../examples/demo-mcp-server.js', import.meta.url));

const config = {
  whatsapp: { verifyToken: 'verify-me', appSecret: 'app-secret', allowedNumbers: [] },
  ai: {
    apiKey: 'test',
    baseUrl: 'https://openrouter.test/api/v1',
    model: 'test/model:free',
    fallbackModels: ['backup/model:free'],
    systemPrompt: 'You are a test bot.',
    maxToolRounds: 5,
    timeoutMs: 5000,
    siteUrl: 'https://bizapp365.com',
    appName: 'test',
    errorMessage: 'ERROR_FALLBACK',
  },
  mcp: {
    url: '',
    command: process.execPath,
    args: [demoServer],
    allowedTools: ['search_products', 'get_order_status', 'get_my_balance'],
  },
  limits: { historyMessages: 12, historyTtlMs: 60_000, rateLimit: 20, rateWindowMs: 60_000 },
};

// Fake OpenRouter: first asks for the search_products tool, then answers using the tool result.
const aiRequests = [];
async function fakeOpenRouter(url, init) {
  const body = JSON.parse(init.body);
  aiRequests.push(body);
  const last = body.messages.at(-1);
  const message =
    last.role === 'tool'
      ? { role: 'assistant', content: `**Found:** ${last.content}` }
      : {
          role: 'assistant',
          content: null,
          tool_calls: [
            { id: 'call_1', type: 'function', function: { name: 'search_products', arguments: '{"query":"laptop"}' } },
          ],
        };
  return new Response(JSON.stringify({ choices: [{ message }] }), { status: 200 });
}

const sent = [];
const read = [];
const fakeWhatsApp = {
  async sendText(to, text) {
    sent.push({ to, text });
  },
  async markReadAndTyping(id) {
    read.push(id);
  },
};

const mcp = createMcp(config.mcp);
const agent = createAgent({ config, mcp, fetchImpl: fakeOpenRouter });
const app = createApp({ config, agent, whatsapp: fakeWhatsApp, mcpEnabled: true });
const server = http.createServer((req, res) => app.handler(req, res));
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

after(async () => {
  server.close();
  await mcp.close();
});

const sign = (body) => 'sha256=' + crypto.createHmac('sha256', config.whatsapp.appSecret).update(body).digest('hex');
const webhookBody = (id, text) =>
  JSON.stringify({
    entry: [
      {
        changes: [
          {
            field: 'messages',
            value: {
              contacts: [{ wa_id: '971500000001', profile: { name: 'Test' } }],
              messages: [{ id, from: '971500000001', type: 'text', text: { body: text } }],
            },
          },
        ],
      },
    ],
  });

test('MCP tools load from the demo server and respect the allowlist', async () => {
  const tools = await mcp.listTools();
  assert.deepEqual(
    tools.map((t) => t.function.name),
    ['search_products', 'get_order_status', 'get_my_balance'],
  );
  assert.match(await mcp.callTool('get_order_status', { order_number: 'SO-1002' }), /Out for delivery/);
  assert.match(await mcp.callTool('get_business_info', {}), /not available/);
});

test('customer_phone is hidden from the AI and always set to the real sender', async () => {
  const balanceTool = (await mcp.listTools()).find((t) => t.function.name === 'get_my_balance');
  assert.equal(balanceTool.function.parameters.properties.customer_phone, undefined);
  assert.ok(!(balanceTool.function.parameters.required ?? []).includes('customer_phone'));

  // The AI (or a prompt-injected customer) tries to read someone else's account: the sender wins.
  const stranger = await mcp.callTool('get_my_balance', { customer_phone: '971501234567' }, { customerPhone: '971559999999' });
  assert.match(stranger, /No customer account/);
  const owner = await mcp.callTool('get_my_balance', {}, { customerPhone: '+971 50 123 4567' });
  assert.match(owner, /Al Noor Trading/);
  assert.match(await mcp.callTool('get_my_balance', {}), /phone number is unknown/);
});

test('webhook verification handshake', async () => {
  const ok = await fetch(`${base}/webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=12345`);
  assert.equal(ok.status, 200);
  assert.equal(await ok.text(), '12345');
  const bad = await fetch(`${base}/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=1`);
  assert.equal(bad.status, 403);
});

test('rejects webhook posts with a bad signature', async () => {
  const body = webhookBody('wamid.bad', 'hi');
  const res = await fetch(`${base}/webhook`, { method: 'POST', body, headers: { 'X-Hub-Signature-256': 'sha256=00' } });
  assert.equal(res.status, 401);
  await app.idle();
  assert.equal(sent.length, 0);
});

test('message -> AI -> MCP tool -> WhatsApp reply, duplicates ignored', async () => {
  const body = webhookBody('wamid.1', 'Do you have laptops?');
  for (let i = 0; i < 2; i++) {
    const res = await fetch(`${base}/webhook`, { method: 'POST', body, headers: { 'X-Hub-Signature-256': sign(body) } });
    assert.equal(res.status, 200);
  }
  await app.idle();

  assert.deepEqual(read, ['wamid.1']);
  assert.equal(sent.length, 1, 'duplicate webhook must not produce a second reply');
  assert.equal(sent[0].to, '971500000001');
  assert.match(sent[0].text, /^\*Found:\* .*Business Laptop 14/); // markdown converted, real tool data used

  const [first, second] = aiRequests;
  assert.deepEqual(first.models, ['test/model:free', 'backup/model:free']);
  assert.equal(first.tools.length, 3);
  assert.match(first.messages[0].content, /Customer WhatsApp number: \+971500000001/);
  assert.equal(second.messages.at(-1).role, 'tool');
  assert.match(second.messages.at(-1).content, /LAP-001/);
});

test('reset command clears history; AI errors send the fallback message', async () => {
  const reset = webhookBody('wamid.2', 'reset');
  await fetch(`${base}/webhook`, { method: 'POST', body: reset, headers: { 'X-Hub-Signature-256': sign(reset) } });
  await app.idle();
  assert.match(sent.at(-1).text, /new conversation/);

  const failingAgent = { reply: async () => Promise.reject(new Error('boom')) };
  const failingApp = createApp({ config, agent: failingAgent, whatsapp: fakeWhatsApp });
  await failingApp.handleIncoming({ id: 'wamid.3', from: '971500000009', name: '', type: 'text', text: 'hello' });
  assert.equal(sent.at(-1).text, 'ERROR_FALLBACK');
});
