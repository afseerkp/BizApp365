// Talk to the AI + MCP tools from your terminal, without WhatsApp: `npm run chat`
// Only OPENROUTER_API_KEY, OPENROUTER_MODEL and (optionally) the MCP_* variables are needed.
import readline from 'node:readline/promises';
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
const tools = await mcp.listTools();
console.log(`Model: ${config.ai.model} | MCP tools: ${tools.length}`);
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
    // CHAT_TEST_PHONE: pretend to be this WhatsApp number (digits with country code) to test customer tools.
    const userId = process.env.CHAT_TEST_PHONE || '971500000000';
    const reply = await agent.reply({ history, userText: text, userId, userName: 'Terminal tester' });
    history = [...history, { role: 'user', content: text }, { role: 'assistant', content: reply }].slice(
      -config.limits.historyMessages,
    );
    console.log(`\nbot > ${toWhatsAppFormat(reply)}\n`);
  } catch (err) {
    console.error(`\n(error) ${err.message}\n`);
  }
}

rl.close();
await mcp.close();
