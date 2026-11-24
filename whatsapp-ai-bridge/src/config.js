// Central configuration, read once from environment variables (.env is loaded by `node --env-file`).

const env = process.env;

const list = (value) =>
  (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const int = (value, fallback) => {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** MCP_SERVER_ARGS may be a JSON array (`["server.js","--flag"]`) or a space-separated string. */
const args = (value) => {
  if (!value) return [];
  const trimmed = value.trim();
  if (trimmed.startsWith('[')) return JSON.parse(trimmed);
  return trimmed.split(/\s+/);
};

const DEFAULT_SYSTEM_PROMPT = `You are the BizApp365 assistant, answering customers on WhatsApp.
- Reply in the same language the customer writes in (English or Arabic).
- Keep replies short and friendly: a few sentences, or a short list.
- Use WhatsApp formatting only: *bold*, _italic_, plain "- " bullets. No tables, no headings.
- Use the available tools to look up real data. Never invent prices, stock, invoices or order details.
- If a tool fails or you cannot help, say so and offer human support at sales@bizapp365.com.`;

export const config = {
  port: int(env.PORT, 3100),

  whatsapp: {
    token: env.WHATSAPP_TOKEN ?? '',
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID ?? '',
    verifyToken: env.WHATSAPP_VERIFY_TOKEN ?? '',
    appSecret: env.WHATSAPP_APP_SECRET ?? '',
    apiVersion: env.WHATSAPP_API_VERSION || 'v23.0',
    // When set, only these numbers (digits only, with country code) get answers. Handy while testing.
    allowedNumbers: list(env.WHATSAPP_ALLOWED_NUMBERS).map((n) => n.replace(/\D/g, '')),
  },

  ai: {
    apiKey: env.OPENROUTER_API_KEY ?? '',
    baseUrl: env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: env.OPENROUTER_MODEL ?? '',
    // Tried in order by OpenRouter if the main model is down or rate-limited.
    fallbackModels: list(env.OPENROUTER_FALLBACK_MODELS),
    systemPrompt: env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT,
    maxToolRounds: int(env.AI_MAX_TOOL_ROUNDS, 5),
    timeoutMs: int(env.AI_TIMEOUT_MS, 60_000),
    siteUrl: env.OPENROUTER_SITE_URL || 'https://bizapp365.com',
    appName: env.OPENROUTER_APP_NAME || 'BizApp365 WhatsApp Assistant',
    errorMessage:
      env.AI_ERROR_MESSAGE ||
      'Sorry, I am having trouble right now. Please try again in a minute, or email sales@bizapp365.com.',
  },

  mcp: {
    // Option A: remote MCP server over HTTP (Streamable HTTP transport).
    url: env.MCP_SERVER_URL ?? '',
    authToken: env.MCP_AUTH_TOKEN ?? '',
    // Option B: local MCP server started as a child process (stdio transport).
    command: env.MCP_SERVER_COMMAND ?? '',
    args: args(env.MCP_SERVER_ARGS),
    cwd: env.MCP_SERVER_CWD || undefined,
    // Only these MCP tools are exposed to WhatsApp users. Empty = all tools.
    allowedTools: list(env.MCP_ALLOWED_TOOLS),
  },

  limits: {
    historyMessages: int(env.HISTORY_MAX_MESSAGES, 12),
    historyTtlMs: int(env.HISTORY_TTL_MINUTES, 30) * 60_000,
    rateLimit: int(env.RATE_LIMIT_MESSAGES, 20),
    rateWindowMs: int(env.RATE_LIMIT_WINDOW_MINUTES, 10) * 60_000,
  },
};

/** Throws a readable error listing every missing variable for the given mode. */
export function validateConfig(cfg, mode) {
  const missing = [];
  if (!cfg.ai.apiKey) missing.push('OPENROUTER_API_KEY');
  if (!cfg.ai.model) missing.push('OPENROUTER_MODEL');
  if (mode === 'server') {
    if (!cfg.whatsapp.token) missing.push('WHATSAPP_TOKEN');
    if (!cfg.whatsapp.phoneNumberId) missing.push('WHATSAPP_PHONE_NUMBER_ID');
    if (!cfg.whatsapp.verifyToken) missing.push('WHATSAPP_VERIFY_TOKEN');
  }
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`);
  }
  if (cfg.mcp.url && cfg.mcp.command) {
    throw new Error('Set either MCP_SERVER_URL or MCP_SERVER_COMMAND, not both.');
  }
}
