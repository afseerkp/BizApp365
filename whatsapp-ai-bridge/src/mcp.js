// MCP client: connects to your MCP server and exposes its tools in the OpenAI/OpenRouter tool format.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MAX_RESULT_CHARS = 12_000;
const MAX_FILE_BYTES = 20 * 1024 * 1024;

/**
 * Tools that take this argument act on "the person who is messaging". The AI never sees it:
 * the bridge removes it from the schema and fills it with the verified WhatsApp sender number,
 * so nobody can ask the AI to look up someone else's number.
 */
export const CUSTOMER_PHONE_ARG = 'customer_phone';

/**
 * Optional role support. When the server has this tool, the bridge asks it who the sender is
 * (manager, salesman, customer, unknown) and offers the AI only the tools whose
 * `_meta["bizapp365/roles"]` include that role. Tools without the key are offered to everyone.
 * The server still checks the role in every tool call; this only keeps the AI's choices relevant.
 */
export const IDENTIFY_TOOL = 'identify_sender';
export const ROLES_META_KEY = 'bizapp365/roles';
const SENDER_CACHE_MS = 5 * 60_000;

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
  let toolCache = null; // { aiTools, nameMap, needsPhone, roles, canIdentify }
  const senders = new Map(); // phone -> { at, sender }

  function reset() {
    const old = client;
    client = null;
    toolCache = null;
    senders.clear();
    old?.close().catch(() => {});
  }

  async function connect() {
    if (client) return client;
    if (connecting) return connecting;
    connecting = (async () => {
      const c = new Client({ name: 'bizapp365-whatsapp-bridge', version: '1.1.0' });
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

    const canIdentify = tools.some((t) => t.name === IDENTIFY_TOOL);
    const offered = tools.filter((t) => t.name !== IDENTIFY_TOOL);
    const allowed = cfg.allowedTools.length ? offered.filter((t) => cfg.allowedTools.includes(t.name)) : offered;
    const nameMap = new Map();
    const needsPhone = new Set();
    const roles = new Map(); // fnName -> string[] (absent = everyone)
    const aiTools = allowed.map((t) => {
      const fnName = toFunctionName(t.name);
      nameMap.set(fnName, t.name);
      const toolRoles = t._meta?.[ROLES_META_KEY];
      if (Array.isArray(toolRoles)) roles.set(fnName, toolRoles);
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
    toolCache = { aiTools, nameMap, needsPhone, roles, canIdentify };
    return toolCache;
  }

  /** The sender's role from the server, cached for a few minutes. Null when the server has no roles. */
  async function identify(phone) {
    const { canIdentify } = await loadTools();
    if (!canIdentify || !phone) return null;
    const hit = senders.get(phone);
    if (hit && Date.now() - hit.at < SENDER_CACHE_MS) return hit.sender;

    const result = await (await connect()).callTool({ name: IDENTIFY_TOOL, arguments: { [CUSTOMER_PHONE_ARG]: phone } });
    let sender = { role: 'unknown', name: null };
    try {
      const parsed = JSON.parse(result.content?.find((i) => i.type === 'text')?.text ?? '{}');
      if (typeof parsed.role === 'string') sender = { role: parsed.role, name: parsed.name ?? null, access: parsed.access };
    } catch {
      // Not JSON: treat as unknown (general tools only).
    }
    senders.set(phone, { at: Date.now(), sender });
    if (senders.size > 5000) senders.delete(senders.keys().next().value);
    return sender;
  }

  const allowedFor = (roles, fnName, sender) => {
    const toolRoles = roles.get(fnName);
    return !sender || !toolRoles || toolRoles.includes(sender.role);
  };

  return {
    enabled,

    /** Every tool in OpenRouter format. Returns [] (and logs) if the MCP server is unreachable, so the bot still chats. */
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
     * The tools this sender may use, and who they are. `sender` is null when the server has no roles
     * (then every tool is offered, as before). On errors: no tools, so the bot still chats.
     */
    async toolsFor(phone) {
      if (!enabled) return { tools: [], sender: null };
      try {
        const { aiTools, roles } = await loadTools();
        const sender = await identify(phone);
        return { tools: aiTools.filter((t) => allowedFor(roles, t.function.name, sender)), sender };
      } catch (err) {
        console.error('[mcp] could not list tools:', err.message);
        reset();
        return { tools: [], sender: null };
      }
    },

    /**
     * Calls a tool by its function name and returns the result as text for the model.
     * `context.customerPhone` is the verified sender; it always overrides anything the AI passed.
     * `context.sender` (from toolsFor) blocks tools outside the sender's role.
     * Files the tool returns (e.g. a PDF statement) are pushed to `context.attachments`, if given.
     */
    async callTool(fnName, args, context = {}) {
      const { nameMap, needsPhone, roles } = await loadTools();
      const name = nameMap.get(fnName);
      if (!name) return `Error: tool "${fnName}" is not available.`;
      if (!allowedFor(roles, fnName, context.sender)) return `Error: tool "${fnName}" is not available for this sender.`;
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
      const { text, files } = formatResult(result);
      if (!files.length) return text;
      if (!Array.isArray(context.attachments)) {
        return `${text}\n(${files.length} file(s) could not be delivered in this channel.)`;
      }
      context.attachments.push(...files);
      return `${text}\n(${files.map((f) => f.name).join(', ')} will be sent to the user as a WhatsApp document right after your reply. Do not paste its contents.)`;
    },

    async close() {
      reset();
    },
  };
}

/** Text for the model, plus any embedded files (resource blobs) as { name, mimeType, data: Buffer }. */
export function formatResult(result) {
  const parts = [];
  const files = [];
  for (const item of result.content ?? []) {
    if (item.type === 'text') parts.push(item.text);
    else if (item.type === 'resource' && typeof item.resource?.blob === 'string') {
      const data = Buffer.from(item.resource.blob, 'base64');
      if (data.length && data.length <= MAX_FILE_BYTES) {
        files.push({ name: fileName(item.resource.uri), mimeType: item.resource.mimeType || 'application/octet-stream', data });
      } else parts.push('[a file was too large to send]');
    } else if (item.type === 'resource' && item.resource?.text) parts.push(item.resource.text);
    else parts.push(`[${item.type} content omitted]`);
  }
  if (!parts.length && result.structuredContent) parts.push(JSON.stringify(result.structuredContent));
  let text = parts.join('\n').trim() || '(no output)';
  if (result.isError) text = `Tool error: ${text}`;
  if (text.length > MAX_RESULT_CHARS) text = `${text.slice(0, MAX_RESULT_CHARS)}\n…(truncated)`;
  return { text, files: result.isError ? [] : files };
}

/** A safe file name from a resource URI: the decoded last path segment, no path parts or odd characters. */
function fileName(uri) {
  let path = String(uri ?? '');
  try {
    path = decodeURIComponent(path);
  } catch {
    // keep as is
  }
  const name = (path.split(/[/\\]/).pop() ?? '')
    .replace(/[^\w.\- ]+/g, '_')
    .replace(/^[.\s]+/, '')
    .trim()
    .slice(0, 120);
  return name || 'document';
}
