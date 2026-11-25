import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { splitMessage, toWhatsAppFormat } from '../src/text.js';
import { extractMessages, verifySignature } from '../src/whatsapp.js';
import { Deduper, KeyedQueue, RateLimiter, ConversationStore } from '../src/state.js';

test('toWhatsAppFormat converts markdown', () => {
  assert.equal(toWhatsAppFormat('## Title\n**bold** and ~~gone~~'), '*Title*\n*bold* and ~gone~');
  assert.equal(toWhatsAppFormat('* one\n* two'), '- one\n- two');
  assert.equal(toWhatsAppFormat('[site](https://bizapp365.com)'), 'site (https://bizapp365.com)');
});

test('splitMessage keeps chunks under the limit', () => {
  const text = Array.from({ length: 300 }, (_, i) => `Line ${i} with some words`).join('\n');
  const chunks = splitMessage(text, 1000);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((c) => c.length <= 1000));
  assert.equal(chunks.join('\n'), text);
  assert.deepEqual(splitMessage('short'), ['short']);
});

test('verifySignature accepts only the correct HMAC', () => {
  const body = Buffer.from('{"a":1}');
  const sig = 'sha256=' + crypto.createHmac('sha256', 'secret').update(body).digest('hex');
  assert.equal(verifySignature(body, sig, 'secret'), true);
  assert.equal(verifySignature(body, sig, 'other'), false);
  assert.equal(verifySignature(body, undefined, 'secret'), false);
  assert.equal(verifySignature(body, 'sha256=zz', 'secret'), false);
  assert.equal(verifySignature(body, undefined, ''), true); // no secret configured
});

test('extractMessages reads text, buttons and media, skips statuses', () => {
  const payload = {
    entry: [
      {
        changes: [
          {
            field: 'messages',
            value: {
              contacts: [{ wa_id: '971501', profile: { name: 'Ali' } }],
              messages: [
                { id: 'm1', from: '971501', type: 'text', text: { body: 'hi' } },
                { id: 'm2', from: '971501', type: 'interactive', interactive: { button_reply: { title: 'Yes' } } },
                { id: 'm3', from: '971501', type: 'image', image: {} },
              ],
            },
          },
          { field: 'messages', value: { statuses: [{ id: 's1', status: 'delivered' }] } },
        ],
      },
    ],
  };
  assert.deepEqual(extractMessages(payload), [
    { id: 'm1', from: '971501', name: 'Ali', type: 'text', text: 'hi' },
    { id: 'm2', from: '971501', name: 'Ali', type: 'interactive', text: 'Yes' },
    { id: 'm3', from: '971501', name: 'Ali', type: 'image', text: null },
  ]);
  assert.deepEqual(extractMessages({}), []);
});

test('Deduper, RateLimiter and ConversationStore', () => {
  const d = new Deduper();
  assert.equal(d.firstTime('x'), true);
  assert.equal(d.firstTime('x'), false);

  const r = new RateLimiter({ limit: 2, windowMs: 60_000 });
  assert.deepEqual(r.check('u'), { allowed: true, firstBlocked: false });
  assert.deepEqual(r.check('u'), { allowed: true, firstBlocked: false });
  assert.deepEqual(r.check('u'), { allowed: false, firstBlocked: true });
  assert.deepEqual(r.check('u'), { allowed: false, firstBlocked: false });

  const s = new ConversationStore({ maxMessages: 3, ttlMs: 60_000 });
  s.append('u', { role: 'user', content: '1' }, { role: 'assistant', content: '2' });
  s.append('u', { role: 'user', content: '3' }, { role: 'assistant', content: '4' });
  assert.deepEqual(s.get('u').map((m) => m.content), ['2', '3', '4']);
  s.reset('u');
  assert.deepEqual(s.get('u'), []);
});

test('KeyedQueue runs tasks for one key in order', async () => {
  const q = new KeyedQueue();
  const order = [];
  const slow = q.run('a', async () => {
    await new Promise((r) => setTimeout(r, 30));
    order.push('a1');
  });
  const fast = q.run('a', async () => order.push('a2'));
  await Promise.all([slow, fast]);
  assert.deepEqual(order, ['a1', 'a2']);
});
