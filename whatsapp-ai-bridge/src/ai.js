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
     * @returns {Promise<string>} the reply text
     */
    async reply({ history, userText, userId, userName }) {
      const tools = await mcp.listTools();
      const context = [
        `Today is ${new Date().toISOString().slice(0, 10)}.`,
        userId ? `Customer WhatsApp number: +${userId}.` : '',
        userName ? `Customer name on WhatsApp: ${userName}.` : '',
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
          messages.push({ role: 'tool', tool_call_id: call.id, content: await runTool(call, userId) });
        }
      }

      // Too many tool rounds: ask for a final answer from what it has so far.
      const final = await complete(messages, tools, { forceAnswer: true });
      return (final.content ?? '').trim() || ai.errorMessage;
    },
  };

  async function runTool(call, customerPhone) {
    const name = call.function?.name;
    let args = {};
    try {
      args = call.function?.arguments ? JSON.parse(call.function.arguments) : {};
    } catch {
      return 'Error: tool arguments were not valid JSON.';
    }
    try {
      console.log(`[ai] tool call ${name} ${JSON.stringify(args).slice(0, 200)}`);
      return await mcp.callTool(name, args, { customerPhone });
    } catch (err) {
      console.error(`[ai] tool ${name} failed:`, err.message);
      return `Error: the tool failed (${err.message}).`;
    }
  }
}
