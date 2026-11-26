// OpenRouter chat completions with an MCP tool-calling loop.

export function createAgent({ config, mcp, fetchImpl = fetch }) {
  const ai = config.ai;

  async function complete(messages, tools, { forceAnswer = false } = {}) {
    const body = { model: ai.model, messages };
    if (ai.fallbackModels.length) body.models = [ai.model, ...ai.fallbackModels];
    if (tools.length) {
      body.tools = tools;
      if (forceAnswer) body.tool_choice = 'none';
    }

    const res = await fetchImpl(`${ai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ai.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': ai.siteUrl,
        'X-Title': ai.appName,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(ai.timeoutMs),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.error) {
      const msg = data?.error?.message ?? `HTTP ${res.status}`;
      throw new Error(`OpenRouter error: ${msg}`);
    }
    const message = data?.choices?.[0]?.message;
    if (!message) throw new Error('OpenRouter returned no message');
    return message;
  }

  return {
    /**
     * @param {object} p
     * @param {Array<{role:string,content:string}>} p.history earlier user/assistant turns
     * @param {string} p.userText the new message
     * @param {string} [p.userId] customer's WhatsApp number (context only – NOT proof of identity)
     * @param {string} [p.userName] customer's WhatsApp profile name
     * @param {Array} [p.attachments] filled with files (e.g. PDF statements) to send after the reply
     * @returns {Promise<string>} the reply text
     */
    async reply({ history, userText, userId, userName, attachments }) {
      const { tools, sender } = mcp.toolsFor ? await mcp.toolsFor(userId) : { tools: await mcp.listTools(), sender: null };
      const context = [
        `Today is ${new Date().toISOString().slice(0, 10)}.`,
        userId ? `Sender WhatsApp number: +${userId}.` : '',
        userName ? `Sender name on WhatsApp: ${userName}.` : '',
        sender ? senderContext(sender) : '',
      ]
        .filter(Boolean)
        .join(' ');

      const messages = [
        { role: 'system', content: `${ai.systemPrompt}\n\n${context}` },
        ...history,
        { role: 'user', content: userText },
      ];

      for (let round = 0; round < ai.maxToolRounds; round++) {
        const msg = await complete(messages, tools);
        const calls = msg.tool_calls ?? [];
        if (!calls.length) return (msg.content ?? '').trim() || ai.errorMessage;

        messages.push({ role: 'assistant', content: msg.content ?? null, tool_calls: calls });
        for (const call of calls) {
          messages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: await runTool(call, { customerPhone: userId, sender, attachments }),
          });
        }
      }

      // Too many tool rounds: ask for a final answer from what it has so far.
      const final = await complete(messages, tools, { forceAnswer: true });
      return (final.content ?? '').trim() || ai.errorMessage;
    },
  };

  async function runTool(call, toolContext) {
    const name = call.function?.name;
    let args = {};
    try {
      args = call.function?.arguments ? JSON.parse(call.function.arguments) : {};
    } catch {
      return 'Error: tool arguments were not valid JSON.';
    }
    try {
      console.log(`[ai] tool call ${name} ${JSON.stringify(args).slice(0, 200)}`);
      return await mcp.callTool(name, args, toolContext);
    } catch (err) {
      console.error(`[ai] tool ${name} failed:`, err.message);
      return `Error: the tool failed (${err.message}).`;
    }
  }
}

/** Tells the model who it is talking to, as decided by the ERP from the WhatsApp number. */
export function senderContext(sender) {
  const who = sender.name ? ` (${sender.name})` : '';
  switch (sender.role) {
    case 'manager':
      return 'The sender is a manager or owner of the company: they may see every report and any customer.';
    case 'salesman':
      return `The sender is a salesman${who}: they may see only their own customers' statements, balances and sales.`;
    case 'customer':
      return `The sender is a customer${who}: they may see only their own account.`;
    default:
      return 'The sender is not registered with the company: answer general questions only (products, prices, contact details).';
  }
}
