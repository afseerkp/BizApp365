#!/usr/bin/env bash
# Deploy the WhatsApp AI bridge on the server that runs the BizApp365 ERP (Docker).
#
#   git clone https://github.com/afseerkp/BizApp365.git /opt/bizapp-site 2>/dev/null || git -C /opt/bizapp-site pull --ff-only
#   bash /opt/bizapp-site/whatsapp-ai-bridge/deploy.sh
#
# What it does (safe to run again):
#   1. Finds the running ERP backend container, its compose folder and its Docker network.
#   2. Makes sure the ERP's backend/.env has MCP_SERVER_TOKEN and MCP_SERVER_USER_ID
#      (generates the token, looks the bot user up), and recreates only the backend
#      container if it had to change them.
#   3. Writes the MCP settings into this folder's .env (your secrets are kept).
#   4. Stops if a secret (OpenRouter / WhatsApp) is still empty, so you can fill it in.
#   5. Builds and starts the bridge on the ERP network, then checks health and the MCP tools.
#
# Options: --bot-user <name> (default whatsapp-bot)   --erp-dir <path> (default: auto)
set -euo pipefail

BOT_USER="whatsapp-bot"
ERP_DIR=""
BACKEND_CONTAINER="bizzapp365-backend"
POSTGRES_CONTAINER="bizzapp365-postgres"
DB_USER="bizzapp_user"
DB_NAME="bizapp_db"
ALLOWED_TOOLS="get_business_info,search_products,get_my_balance,get_my_open_invoices"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bot-user) BOT_USER="$2"; shift 2 ;;
    --erp-dir) ERP_DIR="$2"; shift 2 ;;
    -h|--help) sed -n '2,17p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

BRIDGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$BRIDGE_DIR/.env"

step() { printf '\n\033[0;36m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[0;32m    %s\033[0m\n' "$*"; }
warn() { printf '\033[0;33m    %s\033[0m\n' "$*"; }
die()  { printf '\033[0;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

# Read KEY from an env file (last value wins, surrounding quotes removed).
get_env() {
  [[ -f "$2" ]] || return 0
  awk -v k="$1" -F= '$1==k { sub(/^[^=]*=/, ""); v=$0 } END { gsub(/^["'\'']|["'\'']$/, "", v); print v }' "$2"
}
# Set KEY=VALUE in an env file: replace the first active line, or append.
set_env() {
  local key="$1" value="$2" file="$3" tmp
  tmp="$(mktemp)"
  awk -v k="$key" -v v="$value" -F= '
    $1==k { if (!done) { print k "=" v; done=1 }; next }
    { print }
    END { if (!done) print k "=" v }' "$file" > "$tmp"
  cat "$tmp" > "$file" && rm -f "$tmp"
}

compose() { docker compose "$@"; }

# ---------------------------------------------------------------------------
step "Checking tools"
command -v docker >/dev/null || die "docker is not installed."
docker compose version >/dev/null 2>&1 || die "the docker compose plugin is not installed."
command -v openssl >/dev/null || die "openssl is not installed."
ok "docker $(docker version --format '{{.Server.Version}}'), compose $(docker compose version --short)"

# ---------------------------------------------------------------------------
step "Finding the ERP"
docker inspect "$BACKEND_CONTAINER" >/dev/null 2>&1 || die "container $BACKEND_CONTAINER is not running. Start the ERP first."
if [[ -z "$ERP_DIR" ]]; then
  ERP_DIR="$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project.working_dir" }}' "$BACKEND_CONTAINER")"
fi
[[ -n "$ERP_DIR" && -d "$ERP_DIR" ]] || die "could not find the ERP compose folder; pass --erp-dir <path>."
ERP_PROJECT="$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' "$BACKEND_CONTAINER")"
ERP_FILES="$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project.config_files" }}' "$BACKEND_CONTAINER")"
ERP_SERVICE="$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.service" }}' "$BACKEND_CONTAINER")"
ERP_ENV="$ERP_DIR/backend/.env"
[[ -f "$ERP_ENV" ]] || die "$ERP_ENV not found."
ERP_NETWORK="$(docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' "$BACKEND_CONTAINER" | awk '{print $1}')"
[[ -n "$ERP_NETWORK" ]] || die "could not find the ERP Docker network."
ok "folder:  $ERP_DIR"
ok "network: $ERP_NETWORK"

# ---------------------------------------------------------------------------
step "ERP MCP server settings ($ERP_ENV)"
ERP_CHANGED=0
TOKEN="$(get_env MCP_SERVER_TOKEN "$ERP_ENV")"
USER_ID="$(get_env MCP_SERVER_USER_ID "$ERP_ENV")"

if [[ -z "$USER_ID" ]]; then
  USER_ID="$(docker exec "$POSTGRES_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -tAc \
    "SELECT id FROM users WHERE username = '${BOT_USER//\'/\'\'}' LIMIT 1;" | tr -d '[:space:]')"
  [[ -n "$USER_ID" ]] || die "user '$BOT_USER' not found. Create it in the ERP (view-only role, not a super admin) and run this again."
fi
ok "bot user: $BOT_USER (id $USER_ID)"

if [[ ${#TOKEN} -lt 32 || "$(get_env MCP_SERVER_USER_ID "$ERP_ENV")" != "$USER_ID" ]]; then
  cp -p "$ERP_ENV" "$ERP_ENV.bak.$(date +%Y%m%d%H%M%S)"
  ok "backed up $ERP_ENV"
fi
if [[ ${#TOKEN} -lt 32 ]]; then
  TOKEN="$(openssl rand -hex 32)"
  set_env MCP_SERVER_TOKEN "$TOKEN" "$ERP_ENV"
  ERP_CHANGED=1
  ok "generated a new MCP_SERVER_TOKEN"
else
  ok "keeping the existing MCP_SERVER_TOKEN"
fi
if [[ "$(get_env MCP_SERVER_USER_ID "$ERP_ENV")" != "$USER_ID" ]]; then
  set_env MCP_SERVER_USER_ID "$USER_ID" "$ERP_ENV"
  ERP_CHANGED=1
fi

if [[ $ERP_CHANGED -eq 1 ]]; then
  step "Recreating the ERP backend container to load the new settings"
  FILE_ARGS=()
  IFS=',' read -ra _files <<< "$ERP_FILES"
  for f in "${_files[@]}"; do [[ -n "$f" ]] && FILE_ARGS+=(-f "$f"); done
  (cd "$ERP_DIR" && compose -p "$ERP_PROJECT" "${FILE_ARGS[@]}" up -d --no-deps --no-build "$ERP_SERVICE")
  for _ in $(seq 1 30); do
    docker exec "$BACKEND_CONTAINER" node -e "fetch('http://127.0.0.1:5001/api/mcp-server',{method:'POST'}).then(()=>process.exit(0)).catch(()=>process.exit(1))" 2>/dev/null && break
    sleep 2
  done
else
  ok "ERP settings unchanged; backend left as it is"
fi

MCP_STATUS="$(docker exec "$BACKEND_CONTAINER" node -e "fetch('http://127.0.0.1:5001/api/mcp-server',{method:'POST'}).then(r=>console.log(r.status)).catch(()=>console.log(0))")"
case "$MCP_STATUS" in
  401) ok "/api/mcp-server is on (401 without a token)" ;;
  404) die "/api/mcp-server answers 404: the ERP running here does not have the MCP server code yet, or the settings did not load. Deploy the ERP build that includes it (github.com/afseerkp/BizApp365-ERP, branch feature/invoice-ocr, commit 4979127 or later), then run this again." ;;
  503) die "/api/mcp-server answers 503: user '$BOT_USER' is inactive or a super admin." ;;
  *)   die "/api/mcp-server answered '$MCP_STATUS'. Check: docker logs $BACKEND_CONTAINER" ;;
esac

# ---------------------------------------------------------------------------
step "Bridge settings ($ENV_FILE)"
if [[ ! -f "$ENV_FILE" ]]; then
  cp "$BRIDGE_DIR/.env.example" "$ENV_FILE"
  ok "created .env from .env.example"
fi
chmod 600 "$ENV_FILE"
set_env MCP_SERVER_URL "http://$BACKEND_CONTAINER:5001/api/mcp-server" "$ENV_FILE"
set_env MCP_AUTH_TOKEN "$TOKEN" "$ENV_FILE"
set_env MCP_SERVER_COMMAND "" "$ENV_FILE"
set_env MCP_SERVER_ARGS "" "$ENV_FILE"
[[ -n "$(get_env MCP_ALLOWED_TOOLS "$ENV_FILE")" ]] || set_env MCP_ALLOWED_TOOLS "$ALLOWED_TOOLS" "$ENV_FILE"
ok "MCP settings written (URL over the ERP network, token shared with the ERP)"

# Join the ERP network. docker compose loads this override file automatically.
cat > "$BRIDGE_DIR/docker-compose.override.yml" <<EOF
# Written by deploy.sh: puts the bridge on the ERP's Docker network.
services:
  whatsapp-bridge:
    networks: [erp]
networks:
  erp:
    external: true
    name: $ERP_NETWORK
EOF

MISSING=()
for key in OPENROUTER_API_KEY OPENROUTER_MODEL WHATSAPP_TOKEN WHATSAPP_PHONE_NUMBER_ID WHATSAPP_VERIFY_TOKEN WHATSAPP_APP_SECRET; do
  [[ -n "$(get_env "$key" "$ENV_FILE")" ]] || MISSING+=("$key")
done
if [[ ${#MISSING[@]} -gt 0 ]]; then
  warn "These are still empty in $ENV_FILE:"
  for key in "${MISSING[@]}"; do warn "  $key"; done
  warn "Fill them in (nano $ENV_FILE) and run this script again."
  exit 2
fi

# ---------------------------------------------------------------------------
step "Building and starting the bridge"
(cd "$BRIDGE_DIR" && compose up -d --build)

STATE=""
for _ in $(seq 1 30); do
  STATE="$(docker inspect -f '{{.State.Health.Status}}' whatsapp-bridge 2>/dev/null || true)"
  [[ "$STATE" == healthy || "$STATE" == unhealthy ]] && break
  sleep 2
done
[[ "$STATE" == healthy ]] || { docker logs --tail 30 whatsapp-bridge; die "the bridge is not healthy ($STATE)."; }
ok "container is healthy"

TOOLS="$(docker exec whatsapp-bridge node -e "
fetch(process.env.MCP_SERVER_URL,{method:'POST',headers:{'content-type':'application/json',accept:'application/json, text/event-stream',authorization:'Bearer '+process.env.MCP_AUTH_TOKEN},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list'})})
.then(r=>r.json()).then(j=>console.log((j.result?.tools??[]).map(t=>t.name).join(', ')||'none')).catch(e=>console.log('error: '+e.message))")"
ok "MCP tools the bridge can reach: $TOOLS"

PORT="$(get_env PORT "$ENV_FILE")"; PORT="${PORT:-3100}"
CHALLENGE="$(docker exec whatsapp-bridge node -e "
const u=new URL('http://127.0.0.1:$PORT/webhook');u.search=new URLSearchParams({'hub.mode':'subscribe','hub.verify_token':process.env.WHATSAPP_VERIFY_TOKEN,'hub.challenge':'4242'});
fetch(u).then(r=>r.text()).then(console.log).catch(()=>console.log('fail'))")"
if [[ "$CHALLENGE" == 4242 ]]; then ok "webhook verification answers correctly"; else warn "webhook verification check returned: $CHALLENGE"; fi

docker logs --tail 5 whatsapp-bridge

cat <<EOF

Done. The bridge listens on http://127.0.0.1:$PORT (this server only).

Next, if not done yet:
  1. Cloudflare Zero Trust > Networks > Tunnels > (your tunnel) > Public hostnames > Add:
       wa.bizapp365.com  ->  HTTP  localhost:$PORT
     (if cloudflared runs in a Docker container on the ERP network, use whatsapp-bridge:$PORT instead).
     Do not put Cloudflare Access in front of it; Meta must reach it.
  2. Meta > WhatsApp > Configuration > Webhook: https://wa.bizapp365.com/webhook, verify token from .env,
     subscribe to "messages".
  3. Test from a number in WHATSAPP_ALLOWED_NUMBERS, then clear that line and run this script again.

Logs:   docker logs -f whatsapp-bridge
Update: git -C $(cd "$BRIDGE_DIR/.." && pwd) pull --ff-only && bash $BRIDGE_DIR/deploy.sh
EOF
