// Entry point: `npm start`
import http from 'node:http';
import { config, validateConfig } from './config.js';
import { createMcp } from './mcp.js';
import { createAgent } from './ai.js';
import { createWhatsApp } from './whatsapp.js';
import { createApp } from './app.js';

try {
  validateConfig(config, 'server');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

if (!config.whatsapp.appSecret) {
  console.warn('[server] WHATSAPP_APP_SECRET is not set: webhook signatures are NOT checked. Set it before going live.');
}

const mcp = createMcp(config.mcp);
const agent = createAgent({ config, mcp });
const whatsapp = createWhatsApp(config.whatsapp);
const app = createApp({ config, agent, whatsapp, mcpEnabled: mcp.enabled });

if (mcp.enabled) await mcp.listTools(); // connect early so problems show at startup
else console.warn('[server] No MCP server configured: the bot will chat without tools.');

const server = http.createServer((req, res) => {
  app.handler(req, res).catch((err) => {
    console.error('[server] request failed:', err);
    if (!res.headersSent) res.writeHead(500).end();
  });
});

server.listen(config.port, () => {
  console.log(`[server] listening on http://localhost:${config.port}`);
  console.log(`[server] webhook URL path: /webhook   model: ${config.ai.model}`);
});

async function shutdown() {
  console.log('[server] shutting down…');
  server.close();
  await app.idle();
  await mcp.close();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
