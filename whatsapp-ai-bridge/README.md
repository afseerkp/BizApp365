# BizApp365 WhatsApp AI Bridge

Customers, salesmen and managers message your WhatsApp number → an AI model on **OpenRouter** answers, using your **MCP** tools for real data → the reply (and any PDF) goes back on WhatsApp. Each sender only sees what their role allows.

```
WhatsApp user ─► Meta Cloud API ─► POST /webhook (this service)
                                        │
                                        ├─► OpenRouter (AI model) ◄─► MCP server (your tools)
                                        │
WhatsApp user ◄─ Meta Cloud API ◄───────┘  reply
```

Features: role-based access (customer / salesman / manager, decided by the ERP from the WhatsApp number), PDF statements sent as WhatsApp documents, webhook signature check, duplicate filtering (Meta retries), per-user memory (last 12 turns, 30 min), per-user rate limit, "typing…" indicator, long replies split, Markdown → WhatsApp formatting, model fallbacks, tool allowlist, works without MCP if it is down. Send `reset` on WhatsApp to start a new conversation.

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

The ERP backend serves read-only tools at `POST /api/mcp-server`. It decides **who is messaging** from the WhatsApp number (last 9 digits, so `+971 50 123 4567` and `0501234567` match), first match wins:

| Who | Recognised by | Can ask for |
|---|---|---|
| **Manager / owner** | listed in `MCP_MANAGER_PHONES` (ERP `backend/.env`) | every report: sales by customer and salesman, profit and loss, receivables, payables, stock, purchases, CRM; any customer's statement |
| **Salesman** | **WhatsApp** or **Mobile** field of an active salesman | only the customers assigned to them (account's default salesman): their sales, balances and statements |
| **Customer** | **WhatsApp** or **Phone** field of an active account | only their own balance, open invoices and statement |
| Anyone else | – | products, prices and company contact details |

| Tool | Who | What it answers |
|---|---|---|
| `get_business_info`, `search_products` | everyone | Company details; selling price and "In stock" / "Out of stock" (never cost) |
| `get_my_balance`, `get_my_open_invoices` | customer | Own balance and unpaid invoices |
| `get_statement` | customer, salesman, manager | Ledger statement with running balance (default last 90 days) |
| `send_statement_pdf` | customer, salesman, manager | The statement as a PDF, sent as a WhatsApp document |
| `get_sales_report` | salesman, manager | Sales, returns and net for a period, by customer (and by salesman for managers) |
| `get_customer_balances` | salesman, manager | Outstanding receivables per customer |
| `report_*` (16 tools) | manager | The ERP's management reports: sales summary, profit and loss, payables, low stock, purchases, CRM… |

The bridge asks the ERP who the sender is (`identify_sender`), offers the AI only that role's tools, and always fills in the sender's number itself, so the AI cannot look up anyone else. The ERP checks the role again on every call.

**In the ERP:**

1. Create a role with **view only** on Inventory, Sales and Accounting (plus Purchase and CRM for the managers' reports), and a user (for example `whatsapp-bot`) with that role. It must **not** be a super admin. Its default branch is the one the bot reads.
2. Save each salesman's WhatsApp number on their **salesman** record, and assign customers to salesmen (the account's **default salesman**).
3. Save each customer's WhatsApp number on their **account** (WhatsApp or Phone field).
4. Find the user's id:

   ```powershell
   docker exec bizzapp365-postgres psql -U bizzapp_user -d bizapp_db -c "SELECT id, username FROM users WHERE username = 'whatsapp-bot';"
   ```

5. Generate a token:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Add to `F:\Project\BizApp365\backend\.env`, then rebuild/restart the backend container:

   ```
   MCP_SERVER_TOKEN=<the token>
   MCP_SERVER_USER_ID=<the user id>
   MCP_MANAGER_PHONES=971501234567,971551234567
   ```

**In this bridge's `.env`:**

```
MCP_SERVER_URL=http://localhost:5001/api/mcp-server
MCP_AUTH_TOKEN=<the same token>
MCP_SERVER_COMMAND=
MCP_SERVER_ARGS=
MCP_ALLOWED_TOOLS=
```

Leave `MCP_ALLOWED_TOOLS` empty: the ERP already gives each sender only their role's tools.

Test as a customer, a salesman or a manager by using a number saved in the ERP (PDFs are saved to `chat-files/`):

```powershell
$env:CHAT_TEST_PHONE="971501234567"; npm run chat
```

### Other MCP servers

Any MCP server works: `MCP_SERVER_URL` for HTTP, or `MCP_SERVER_COMMAND` + `MCP_SERVER_ARGS` (JSON array) to start a local process. A tool that has a `customer_phone` argument gets the sender's number filled in automatically. Roles are optional: if the server has an `identify_sender` tool, tools listing roles in `_meta["bizapp365/roles"]` are offered only to those roles. A tool result with an embedded `resource` blob (e.g. a PDF) is sent to the sender as a WhatsApp document. The demo server shows both (manager `971501111111`, salesman `971502222222`, customer `971501234567`).

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

**One command:** on the ERP server, as root:

```bash
git clone https://github.com/afseerkp/BizApp365.git /opt/bizapp-site 2>/dev/null || git -C /opt/bizapp-site pull --ff-only
bash /opt/bizapp-site/whatsapp-ai-bridge/deploy.sh
```

Add the managers' and owners' WhatsApp numbers (they get every report; salesmen and customers are recognised from their ERP records):

```bash
bash /opt/bizapp-site/whatsapp-ai-bridge/deploy.sh --manager-phones 971501234567,971551234567
```

On the first run it asks for the **subdomain** of the public address: `<name>.bizapp365.com`, default `wa` → `wa.bizapp365.com`. It is saved in `.env` as `PUBLIC_SUBDOMAIN`. To change it later:

```bash
bash /opt/bizapp-site/whatsapp-ai-bridge/deploy.sh --subdomain chat   # → chat.bizapp365.com
```

Then update the Cloudflare tunnel hostname and the Meta webhook URL to the new address (the script prints both). `login`, `www`, `api` and `mail` are refused.

`deploy.sh` finds the ERP container and its network, sets `MCP_SERVER_TOKEN` / `MCP_SERVER_USER_ID` (and `MCP_MANAGER_PHONES` when given) in the ERP (backing up its `.env` first), writes the MCP settings into the bridge `.env`, stops if an OpenRouter/WhatsApp secret is still empty, then builds, starts and checks the bridge. Run it again after filling in secrets or pulling updates. HTTPS and the Meta webhook (steps 3–4 below) are still up to you.

**Cloudflare Tunnel (how the live ERP at `login.bizapp365.com` is published):** no nginx or certbot needed. In Cloudflare Zero Trust → Networks → Tunnels → your tunnel → **Public hostnames → Add**: `<subdomain>.bizapp365.com` (e.g. `wa.bizapp365.com`) → type **HTTP**, URL `localhost:3100` (or `whatsapp-bridge:3100` if `cloudflared` runs as a container on the ERP's Docker network). Don't protect it with Cloudflare Access, and if a WAF / Bot Fight rule blocks Meta's POSTs, add a skip rule for `/webhook` on that hostname. Meta webhook URL: `https://<subdomain>.bizapp365.com/webhook`.

**By hand:**

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

- **Anyone can message a WhatsApp number.** Only the tools for unregistered senders (products, prices, contact details) are open to strangers. Never expose tools that edit data.
- Access depends on the WhatsApp number, so keep numbers in the ERP correct: a wrong number on a salesman or account gives its holder that access. Managers see profit, costs and every customer – list only trusted numbers in `MCP_MANAGER_PHONES`. Remove a person's number when they leave.
- The sender's number is given to the AI as *context*, not proof of identity. The **ERP** checks the number and role on every tool call – the AI cannot widen access.
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
