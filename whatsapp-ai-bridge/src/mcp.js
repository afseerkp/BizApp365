// MCP client: connects to your MCP server and exposes its tools in the OpenAI/OpenRouter tool format.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MAX_RESULT_CHARS = 12_000;

/**
 * Tools that take this argument act on "the customer who is messaging". The AI never sees it:
 * the bridge removes it from the schema and fills it with the verified WhatsApp sender number,
 * so a customer cannot ask the AI to look up someone else's number.
 */
export const CUSTOMER_PHONE_ARG = 'customer_phone';

function hideCustomerPhone(schema) {
  const properties = { ...(schema.properties ?? {}) };
  delete properties[CUSTOMER_PHONE_ARG];
  const required = (schema.required ?? []).filter((r) => r !== CUSTOMER_PHONE_ARG);
  return { ...schema, properties, ...(required.length ? { required } : { required: undefined }) };
}

/** OpenAI-style function names must match ^[a-zA-Z0-9_-]{1,64}$; MCP names may contain dots etc. */
const toFunctionName = (name) => name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);

export function createMcp(cfg) {
  const enabled = Boolean(cfg.url || cfg.command);
  let client = null;
  let connecting = null;
  let toolCache = null; // { aiTools, nameMap, needsPhone }

  function reset() {
    const old = client;
    client = null;
    toolCache = null;
    old?.close().catch(() => {});
  }

  async function connect() {
    if (client) return client;
    if (connecting) return connecting;
    connecting = (async () => {
      const c = new Client({ name: 'bizapp365-whatsapp-bridge', version: '1.0.0' });
      const transport = cfg.url
        ? new StreamableHTTPClientTransport(new URL(cfg.url), {
            requestInit: cfg.authToken ? { headers: { Authorization: `Bearer ${cfg.authToken}` } } : undefined,
          })
        : new StdioClientTransport({
            command: cfg.command,
            args: cfg.args,
            cwd: cfg.cwd,
            env: { ...process.env },
            stderr: 'inherit',
          });
      c.onclose = () => {
        if (client === c) {
          client = null;
          toolCache = null;
        }
      };
      await c.connect(transport);
      client = c;
      console.log(`[mcp] connected to ${cfg.url || [cfg.command, ...cfg.args].join(' ')}`);
      return c;
    })().finally(() => {
      connecting = null;
    });
    return connecting;
  }

  async function loadTools() {
    if (toolCache) return toolCache;
    const c = await connect();
    const tools = [];
    let cursor;
    do {
      const page = await c.listTools(cursor ? { cursor } : {});
      tools.push(...page.tools);
      cursor = page.nextCursor;
    } while (cursor);

    const allowed = cfg.allowedTools.length ? tools.filter((t) => cfg.allowedTools.includes(t.name)) : tools;
    const nameMap = new Map();
    const needsPhone = new Set();
    const aiTools = allowed.map((t) => {
      const fnName = toFunctionName(t.name);
      nameMap.set(fnName, t.name);
      let parameters = t.inputSchema?.type === 'object' ? t.inputSchema : { type: 'object', properties: {} };
      if (parameters.properties?.[CUSTOMER_PHONE_ARG]) {
        needsPhone.add(fnName);
        parameters = hideCustomerPhone(parameters);
      }
      return {
        type: 'function',
        function: {
          name: fnName,
          description: (t.description ?? t.title ?? t.name).slice(0, 1024),
          parameters,
        },
      };
    });
    console.log(`[mcp] ${aiTools.length} tool(s) available: ${[...nameMap.values()].join(', ') || '(none)'}`);
    toolCache = { aiTools, nameMap, needsPhone };
    return toolCache;
  }

  return {
    enabled,

    /** Tools in OpenRouter format. Returns [] (and logs) if the MCP server is unreachable, so the bot still chats. */
    async listTools() {
      if (!enabled) return [];
      try {
        return (await loadTools()).aiTools;
      } catch (err) {
        console.error('[mcp] could not list tools:', err.message);
        reset();
        return [];
      }
    },

    /**
     * Calls a tool by its function name and returns the result as text for the model.
     * `context.customerPhone` is the verified sender; it always overrides anything the AI passed.
     */
    async callTool(fnName, args, context = {}) {
      const { nameMap, needsPhone } = await loadTools();
      const name = nameMap.get(fnName);
      if (!name) return `Error: tool "${fnName}" is not available.`;
      if (needsPhone.has(fnName)) {
        if (!context.customerPhone) return 'Error: the customer phone number is unknown for this conversation.';
        args = { ...args, [CUSTOMER_PHONE_ARG]: context.customerPhone };
      }
      let result;
      try {
        result = await (await connect()).callTool({ name, arguments: args });
      } catch (err) {
        reset();
        throw err;
      }
      return formatResult(result);
    },

    async close() {
      reset();
    },
  };
}

function formatResult(result) {
  const parts = (result.content ?? []).map((item) => {
    if (item.type === 'text') return item.text;
    if (item.type === 'resource' && item.resource?.text) return item.resource.text;
    return `[${item.type} content omitted]`;
  });
  if (!parts.length && result.structuredContent) parts.push(JSON.stringify(result.structuredContent));
  let text = parts.join('\n').trim() || '(no output)';
  if (result.isError) text = `Tool error: ${text}`;
  if (text.length > MAX_RESULT_CHARS) text = `${text.slice(0, MAX_RESULT_CHARS)}\n…(truncated)`;
  return text;
}
