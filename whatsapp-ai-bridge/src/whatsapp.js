// WhatsApp Cloud API (Meta) – webhook parsing, signature check and sending.
import crypto from 'node:crypto';
import { splitMessage } from './text.js';

/**
 * Checks Meta's X-Hub-Signature-256 header (HMAC-SHA256 of the raw body with the app secret).
 * Returns true when no app secret is configured, so local testing still works; set it in production.
 */
export function verifySignature(rawBody, header, appSecret) {
  if (!appSecret) return true;
  if (typeof header !== 'string' || !header.startsWith('sha256=')) return false;
  const expected = crypto.createHmac('sha256', appSecret).update(rawBody).digest();
  const received = Buffer.from(header.slice('sha256='.length), 'hex');
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

/** Pulls incoming user messages out of a webhook payload. Status updates (sent/delivered/read) are skipped. */
export function extractMessages(payload) {
  const out = [];
  for (const entry of payload?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      if (change?.field !== 'messages') continue;
      const value = change.value ?? {};
      const names = new Map((value.contacts ?? []).map((c) => [c.wa_id, c.profile?.name]));
      for (const m of value.messages ?? []) {
        out.push({
          id: m.id,
          from: m.from,
          name: names.get(m.from) ?? '',
          type: m.type,
          text: messageText(m),
        });
      }
    }
  }
  return out;
}

function messageText(m) {
  switch (m.type) {
    case 'text':
      return m.text?.body ?? null;
    case 'button':
      return m.button?.text ?? null;
    case 'interactive':
      return m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title ?? null;
    default:
      return null; // image, audio, video, document, sticker, location, ...
  }
}

export function createWhatsApp(cfg, fetchImpl = fetch) {
  const endpoint = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`;

  async function post(body) {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', ...body }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`WhatsApp API ${res.status}: ${detail.slice(0, 500)}`);
    }
    return res.json();
  }

  return {
    /** Sends a text reply, split into several messages if it is too long. */
    async sendText(to, text) {
      for (const chunk of splitMessage(text)) {
        await post({ recipient_type: 'individual', to, type: 'text', text: { preview_url: false, body: chunk } });
      }
    },

    /** Marks the message as read (blue ticks) and shows "typing…" until we reply. Best effort. */
    async markReadAndTyping(messageId) {
      try {
        await post({ status: 'read', message_id: messageId, typing_indicator: { type: 'text' } });
      } catch (err) {
        console.warn('[whatsapp] could not mark as read:', err.message);
      }
    },
  };
}
