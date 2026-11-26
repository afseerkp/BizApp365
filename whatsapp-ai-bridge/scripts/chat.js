// Talk to the AI + MCP tools from your terminal, without WhatsApp: `npm run chat`
// Only OPENROUTER_API_KEY, OPENROUTER_MODEL and (optionally) the MCP_* variables are needed.
import readline from 'node:readline/promises';
import fs from 'node:fs';
import path from 'node:path';
import { config, validateConfig } from '../src/config.js';
import { createMcp } from '../src/mcp.js';
import { createAgent } from '../src/ai.js';
import { toWhatsAppFormat } from '../src/text.js';

try {
  validateConfig(config, 'chat');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const mcp = createMcp(config.mcp);
const agent = createAgent({ config, mcp });
// CHAT_TEST_PHONE: pretend to be this WhatsApp number (digits with country code) to test customer/staff tools.
const userId = process.env.CHAT_TEST_PHONE || '971500000000';
const { tools, sender } = await mcp.toolsFor(userId);
console.log(`Model: ${config.ai.model} | MCP tools for +${userId}: ${tools.length}${sender ? ` | role: ${sender.role}${sender.name ? ` (${sender.name})` : ''}` : ''}`);
console.log('Type a message. "/reset" clears history, "/exit" quits.\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let history = [];

while (true) {
  const text = (await rl.question('you > ')).trim();
  if (!text) continue;
  if (text === '/exit') break;
  if (text === '/reset') {
    history = [];
    console.log('(history cleared)\n');
    continue;
  }
  try {
    const attachments = [];
    const reply = await agent.reply({ history, userText: text, userId, userName: 'Terminal tester', attachments });
    history = [...history, { role: 'user', content: text }, { role: 'assistant', content: reply }].slice(
      -config.limits.historyMessages,
    );
    console.log(`\nbot > ${toWhatsAppFormat(reply)}\n`);
    for (const file of attachments) {
      const out = path.resolve('chat-files', file.name);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, file.data);
      console.log(`(file saved: ${out})\n`);
    }
  } catch (err) {
    console.error(`\n(error) ${err.message}\n`);
  }
}

rl.close();
await mcp.close();
