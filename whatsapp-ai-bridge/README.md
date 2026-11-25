# BizApp365 WhatsApp AI Bridge

Customers message your WhatsApp number → an AI model on **OpenRouter** answers, using your **MCP** tools for real data → the reply goes back on WhatsApp.

```
WhatsApp user ─► Meta Cloud API ─► POST /webhook (this service)
                                        │
                                        ├─► OpenRouter (AI model) ◄─► MCP server (your tools)
                                        │
WhatsApp user ◄─ Meta Cloud API ◄───────┘  reply
```

Features: webhook signature check, duplicate filtering (Meta retries), per-user memory (last 12 turns, 30 min), per-user rate limit, "typing…" indicator, long replies split, Markdown → WhatsApp formatting, model fallbacks, tool allowlist, works without MCP if it is down. Send `reset` on WhatsApp to start a new conversation.

Requires **Node.js 22+**.

## 1. Install

```powershell
cd whatsapp-ai-bridge
npm install
Copy-Item .env.example .env
```

## 2. OpenRouter

1. Create a key at https://openrouter.ai/keys → `OPENROUTER_API_KEY`.
2. At https://openrouter.ai/models search `free` and enable the **Tools** filter. Copy a model id → `OPENROUTER_MODEL`. Add one or two more to `OPENROUTER_FALLBACK_MODELS`.
3. Test it in your terminal (uses the demo MCP server by default):

```powershell
npm run chat
```

Try: "Do you have laptops?" or "Where is order SO-1002?"

## 3. Connect the BizApp365 ERP

The ERP backend serves read-only tools at `POST /api/mcp-server`:

| Tool | What it answers |
|---|---|
| `get_business_info` | Company name, phone, email, website, address |
| `search_products` | Selling price and "In stock" / "Out of stock" (never cost) |
| `get_my_balance` | The sender's own account balance |
| `get_my_open_invoices` | The sender's own unpaid invoices |

The two `get_my_*` tools find the customer by matching the WhatsApp number to the **WhatsApp** or **Phone** field of an active account (last 9 digits, so `+971 50 123 4567` and `0501234567` match). The bridge always fills that number in itself; the AI cannot choose it.

**In the ERP:**

1. Create a role with **view only** on Inventory, Sales and Accounting, and a user (for example `whatsapp-bot`) with that role. It must **not** be a super admin. Its default branch is the one the bot reads.
2. Find the user's id:

   ```powershell
   docker exec bizzapp365-postgres psql -U bizzapp_user -d bizapp_db -c "SELECT id, username FROM users WHERE username = 'whatsapp-bot';"
   ```

3. Generate a token:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Add to `F:\Project\BizApp365\backend\.env`, then rebuild/restart the backend container:

   ```
   MCP_SERVER_TOKEN=<the token>
   MCP_SERVER_USER_ID=<the user id>
   ```

**In this bridge's `.env`:**

```
MCP_SERVER_URL=http://localhost:5001/api/mcp-server
MCP_AUTH_TOKEN=<the same token>
MCP_SERVER_COMMAND=
MCP_SERVER_ARGS=
MCP_ALLOWED_TOOLS=get_business_info,search_products,get_my_balance,get_my_open_invoices
```

Test as a real customer, using a phone number saved on one of your accounts:

```powershell
$env:CHAT_TEST_PHONE="971501234567"; npm run chat
```

### Other MCP servers

Any MCP server works: `MCP_SERVER_URL` for HTTP, or `MCP_SERVER_COMMAND` + `MCP_SERVER_ARGS` (JSON array) to start a local process. A tool that has a `customer_phone` argument gets the sender's number filled in automatically.

## 4. WhatsApp Cloud API (Meta)

1. https://developers.facebook.com → **Create app** → type *Business* → add **WhatsApp**.
2. **WhatsApp → API Setup**: copy the *temporary access token* → `WHATSAPP_TOKEN`, and the *Phone number ID* → `WHATSAPP_PHONE_NUMBER_ID`. Add your own phone as a test recipient.
3. **App settings → Basic**: copy *App secret* → `WHATSAPP_APP_SECRET`.
4. Invent any string for `WHATSAPP_VERIFY_TOKEN`.
5. Start the server and expose it publicly (Meta needs HTTPS):

```powershell
npm start
```

```powershell
npx cloudflared tunnel --url http://localhost:3100
```

6. **WhatsApp → Configuration → Webhook**: Callback URL = `https://<tunnel-url>/webhook`, Verify token = your `WHATSAPP_VERIFY_TOKEN` → **Verify and save**. Then **subscribe** to the `messages` field.
7. Send a WhatsApp message to the test number. 🎉

For production: create a **System User** permanent token (Business Settings → System users) instead of the 24-hour temporary token, and add your real business number.

## 5. Deploy

### Docker (live server)

1. In the live ERP's `production/backend/.env`, set a **new** `MCP_SERVER_TOKEN` and the `whatsapp-bot` user's `MCP_SERVER_USER_ID`, then rebuild the backend. `curl -i -X POST https://<erp-domain>/api/mcp-server` should now answer **401** (404 means it is still off).
2. On the server:

   ```bash
   git clone https://github.com/afseerkp/BizApp365.git /opt/bizapp-site
   cd /opt/bizapp-site/whatsapp-ai-bridge
   cp .env.example .env && nano .env   # MCP_SERVER_URL=https://<erp-domain>/api/mcp-server, clear MCP_SERVER_COMMAND/ARGS
   docker compose up -d --build
   curl http://127.0.0.1:3100/health
   ```

3. Put HTTPS in front (the port is bound to `127.0.0.1` only), e.g. nginx on `wa.<domain>` with `proxy_pass http://127.0.0.1:3100;` and `certbot --nginx -d wa.<domain>`.
4. Set the Meta webhook to `https://wa.<domain>/webhook` (step 4).

Logs: `docker compose logs -f`. Update: `git pull && docker compose up -d --build`. After editing `.env`: `docker compose up -d` (a plain restart does not reload it).

The image does not include the demo MCP server, so use `MCP_SERVER_URL`. To reach the ERP over its Docker network instead of the public URL, see the comments in `docker-compose.yml`.

### Other hosts

Any Node host works (Render, Railway, Fly.io, Azure App Service, a VPS). Set the same environment variables there, start with `npm start`, and point the Meta webhook to `https://<your-host>/webhook`. Health check: `GET /health`.

Memory, rate limits and duplicate filtering are in memory, so run **one instance**. (For several instances, move `src/state.js` to Redis.)

## Security – read before going live

- **Anyone can message a WhatsApp number.** Every MCP tool you expose can be used by any stranger. Set `MCP_ALLOWED_TOOLS` to read-only, customer-safe tools only – never tools that edit data, show other customers' records, or reveal costs/margins.
- The customer's phone number is given to the AI as *context*, not proof of identity. If a tool returns personal data (invoices, balances), the **MCP tool itself** should check the phone number against the customer record – don't rely on the AI to do it.
- Always set `WHATSAPP_APP_SECRET` in production, so forged webhook calls are rejected.
- Use `WHATSAPP_ALLOWED_NUMBERS` while testing so only your team gets answers.

## Costs

- OpenRouter `:free` models: free with daily request limits; move to a paid model for real traffic.
- WhatsApp: replies inside the 24-hour customer service window are free; business-initiated template messages are charged by Meta.

## Project layout

| File | Purpose |
|---|---|
| `src/server.js` | Entry point, wires everything together |
| `src/app.js` | Webhook routes and the message → reply flow |
| `src/ai.js` | OpenRouter calls and the tool-calling loop |
| `src/mcp.js` | MCP client (HTTP or stdio), tool listing and calls |
| `src/whatsapp.js` | Meta API: signature check, parsing, sending |
| `src/state.js` | History, dedupe, rate limit, per-user queue |
| `src/text.js` | WhatsApp formatting and message splitting |
| `scripts/chat.js` | Terminal chat for testing without WhatsApp |
| `examples/demo-mcp-server.js` | Example MCP server with fake data |
| `Dockerfile`, `docker-compose.yml` | Container build and run for the live server |

Run tests with `npm test`.
