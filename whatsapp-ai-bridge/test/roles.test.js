// Roles and files: each sender gets only their role's tools, and PDF results go out as WhatsApp documents.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createMcp, formatResult } from '../src/mcp.js';
import { createAgent } from '../src/ai.js';
import { createApp } from '../src/app.js';
import { createWhatsApp } from '../src/whatsapp.js';

const demoServer = fileURLToPath(new URL('../examples/demo-mcp-server.js', import.meta.url));

const config = {
  whatsapp: { verifyToken: 'v', appSecret: '', allowedNumbers: [] },
  ai: {
    apiKey: 'test',
    baseUrl: 'https://openrouter.test/api/v1',
    model: 'test/model',
    fallbackModels: [],
    systemPrompt: 'Test bot.',
    maxToolRounds: 5,
    timeoutMs: 5000,
    siteUrl: 'https://bizapp365.com',
    appName: 'test',
    errorMessage: 'ERROR_FALLBACK',
  },
  mcp: { url: '', command: process.execPath, args: [demoServer], allowedTools: [] },
  limits: { historyMessages: 12, historyTtlMs: 60_000, rateLimit: 20, rateWindowMs: 60_000 },
};

const MANAGER = '971501111111';
const SALESMAN = '971502222222';
const CUSTOMER = '971501234567';
const STRANGER = '971509999999';

const mcp = createMcp(config.mcp);
after(() => mcp.close());

const names = async (phone) => (await mcp.toolsFor(phone)).tools.map((t) => t.function.name).sort();

test('each sender is offered only the tools of their role', async () => {
  const general = ['get_business_info', 'get_order_status', 'search_products'];
  assert.deepEqual(await names(STRANGER), general);
  assert.deepEqual(await names(CUSTOMER), [...general, 'get_my_balance', 'send_statement_pdf'].sort());
  assert.deepEqual(await names(SALESMAN), [...general, 'get_sales_report', 'send_statement_pdf'].sort());
  assert.deepEqual(await names(MANAGER), [...general, 'get_sales_report', 'send_statement_pdf'].sort());
  assert.equal((await mcp.toolsFor(SALESMAN)).sender.role, 'salesman');
  // identify_sender is for the bridge only, never offered to the AI.
  assert.ok(!(await mcp.listTools()).some((t) => t.function.name === 'identify_sender'));
});

test('a tool outside the sender role is refused by the bridge too', async () => {
  const { sender } = await mcp.toolsFor(CUSTOMER);
  const out = await mcp.callTool('get_sales_report', {}, { customerPhone: CUSTOMER, sender });
  assert.match(out, /not available for this sender/);
});

test('PDF results become attachments, not text for the model', async () => {
  const { sender } = await mcp.toolsFor(CUSTOMER);
  const attachments = [];
  const out = await mcp.callTool('send_statement_pdf', { customer: 'Someone Else' }, { customerPhone: CUSTOMER, sender, attachments });
  assert.match(out, /Al Noor Trading/); // a customer always gets their own statement
  assert.match(out, /will be sent to the user as a WhatsApp document/);
  assert.equal(attachments.length, 1);
  assert.equal(attachments[0].name, 'Statement-Al Noor Trading.pdf');
  assert.equal(attachments[0].mimeType, 'application/pdf');
  assert.ok(attachments[0].data.toString().startsWith('%PDF-1.4'));
  assert.ok(!out.includes('JVBER'), 'base64 must not reach the model');
});

test('formatResult drops files from error results and cleans file names', () => {
  const blob = Buffer.from('x').toString('base64');
  const res = formatResult({
    content: [{ type: 'resource', resource: { uri: 'x://files/..%2F..%2Fetc%2Fpasswd', mimeType: 'text/plain', blob } }],
  });
  assert.equal(res.files[0].name, 'passwd');
  assert.equal(formatResult({ isError: true, content: [{ type: 'resource', resource: { uri: 'a.pdf', blob } }] }).files.length, 0);
});

test('WhatsApp message asking for a statement -> reply text, then the PDF as a document', async () => {
  // Fake OpenRouter: asks for the PDF tool, then answers.
  const aiRequests = [];
  const fakeOpenRouter = async (_url, init) => {
    const body = JSON.parse(init.body);
    aiRequests.push(body);
    const last = body.messages.at(-1);
    const message =
      last.role === 'tool'
        ? { role: 'assistant', content: 'Here is your statement.' }
        : {
            role: 'assistant',
            content: null,
            tool_calls: [{ id: 'c1', type: 'function', function: { name: 'send_statement_pdf', arguments: '{}' } }],
          };
    return new Response(JSON.stringify({ choices: [{ message }] }), { status: 200 });
  };

  // Real WhatsApp client against a fake Graph API: checks the media upload and the document message.
  const graph = [];
  const fakeGraph = async (url, init) => {
    if (url.endsWith('/media')) {
      const file = init.body.get('file');
      graph.push({ kind: 'upload', type: init.body.get('type'), name: file.name, size: file.size });
      return new Response(JSON.stringify({ id: 'media-123' }), { status: 200 });
    }
    graph.push({ kind: 'message', body: JSON.parse(init.body) });
    return new Response('{}', { status: 200 });
  };
  const whatsapp = createWhatsApp({ apiVersion: 'v23.0', phoneNumberId: '555', token: 't' }, fakeGraph);

  const agent = createAgent({ config, mcp, fetchImpl: fakeOpenRouter });
  const app = createApp({ config, agent, whatsapp, mcpEnabled: true });
  await app.handleIncoming({ id: 'wamid.pdf', from: CUSTOMER, name: 'Test', type: 'text', text: 'Send my statement' });

  assert.match(aiRequests[0].messages[0].content, /The sender is a customer \(Al Noor Trading\)/);
  const messages = graph.filter((g) => g.kind === 'message').map((g) => g.body);
  assert.equal(messages[0].status, 'read');
  assert.equal(messages[1].type, 'text');
  assert.equal(messages[1].text.body, 'Here is your statement.');
  assert.deepEqual(graph.find((g) => g.kind === 'upload'), {
    kind: 'upload',
    type: 'application/pdf',
    name: 'Statement-Al Noor Trading.pdf',
    size: graph.find((g) => g.kind === 'upload').size,
  });
  assert.deepEqual(messages[2], {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: CUSTOMER,
    type: 'document',
    document: { id: 'media-123', filename: 'Statement-Al Noor Trading.pdf' },
  });
});
