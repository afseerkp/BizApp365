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
# Options:
#   --subdomain <name>  public address is <name>.bizapp365.com (asked on first run, default "wa";
#                       remembered in .env as PUBLIC_SUBDOMAIN; pass it again to change it)
#   --bot-user <name>   ERP user the bot reads as (default whatsapp-bot)
#   --manager-phones <list>  WhatsApp numbers of managers / owners who may read every report,
#                       comma separated, e.g. "971501234567,971551234567" (saved in the ERP .env
#                       as MCP_MANAGER_PHONES; pass "" to remove them all)
#   --erp-dir <path>    ERP compose folder (default: found from the running container)
set -euo pipefail

BASE_DOMAIN="bizapp365.com"
DEFAULT_SUBDOMAIN="wa"
RESERVED_SUBDOMAINS="login www api mail"
SUBDOMAIN=""
BOT_USER="whatsapp-bot"
ERP_DIR=""
BACKEND_CONTAINER="bizzapp365-backend"
POSTGRES_CONTAINER="bizzapp365-postgres"
DB_USER="bizzapp_user"
DB_NAME="bizapp_db"
# Older versions of this script pinned this allowlist; the ERP now decides per sender which tools apply.
OLD_ALLOWED_TOOLS="get_business_info,search_products,get_my_balance,get_my_open_invoices"
MANAGER_PHONES=""
MANAGER_PHONES_GIVEN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --subdomain) [[ $# -ge 2 ]] || { echo "--subdomain needs a name, e.g. --subdomain chat" >&2; exit 1; }
                 SUBDOMAIN="$2"; shift 2 ;;
    --bot-user) BOT_USER="$2"; shift 2 ;;
    --manager-phones) [[ $# -ge 2 ]] || { echo "--manager-phones needs a list, e.g. --manager-phones 971501234567" >&2; exit 1; }
                      MANAGER_PHONES="$2"; MANAGER_PHONES_GIVEN=1; shift 2 ;;
    --erp-dir) ERP_DIR="$2"; shift 2 ;;
    -h|--help) sed -n '2,24p' "$0"; exit 0 ;;
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

# Normalise and check a subdomain label. "WA", "wa.bizapp365.com" and "https://wa.bizapp365.com/" all give "wa".
normalize_subdomain() {
  local s="${1,,}"
  s="${s#http://}"; s="${s#https://}"; s="${s%%/*}"; s="${s%.}"
  s="${s%.$BASE_DOMAIN}"
  printf '%s' "$s"
}
valid_subdomain() {
  [[ "$1" =~ ^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$ ]] || return 1
  [[ " $RESERVED_SUBDOMAINS " != *" $1 "* ]]
}
# Sets SUBDOMAIN and PUBLIC_HOST, and saves PUBLIC_SUBDOMAIN in .env.
choose_subdomain() {
  local given saved answer
  given="$(normalize_subdomain "${1:-}")"
  saved="$(normalize_subdomain "$(get_env PUBLIC_SUBDOMAIN "$ENV_FILE")")"
  if [[ -n "$given" ]]; then
    SUBDOMAIN="$given"
  elif [[ -n "$saved" ]]; then
    SUBDOMAIN="$saved"
  elif [[ -t 0 ]]; then
    while :; do
      read -r -p "    Subdomain for the WhatsApp webhook (<name>.$BASE_DOMAIN) [$DEFAULT_SUBDOMAIN]: " answer
      SUBDOMAIN="$(normalize_subdomain "${answer:-$DEFAULT_SUBDOMAIN}")"
      valid_subdomain "$SUBDOMAIN" && break
      warn "'$SUBDOMAIN' can't be used: letters, digits and '-' only, and not one of: $RESERVED_SUBDOMAINS"
    done
  else
    SUBDOMAIN="$DEFAULT_SUBDOMAIN"
  fi
  valid_subdomain "$SUBDOMAIN" || die "'$SUBDOMAIN' can't be used as a subdomain: letters, digits and '-' only (max 63), and not one of: $RESERVED_SUBDOMAINS"
  if [[ -n "$saved" && "$saved" != "$SUBDOMAIN" ]]; then
    warn "changing the address from $saved.$BASE_DOMAIN to $SUBDOMAIN.$BASE_DOMAIN:"
    warn "update the Cloudflare tunnel hostname and the Meta webhook URL to match (shown at the end)"
  fi
  set_env PUBLIC_SUBDOMAIN "$SUBDOMAIN" "$ENV_FILE"
  PUBLIC_HOST="$SUBDOMAIN.$BASE_DOMAIN"
}

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

# Changes KEY in the ERP .env (backing the file up once first) and marks the backend for a restart.
erp_set() {
  if [[ $ERP_CHANGED -eq 0 ]]; then
    cp -p "$ERP_ENV" "$ERP_ENV.bak.$(date +%Y%m%d%H%M%S)"
    ok "backed up $ERP_ENV"
  fi
  set_env "$1" "$2" "$ERP_ENV"
  ERP_CHANGED=1
}

if [[ ${#TOKEN} -lt 32 ]]; then
  TOKEN="$(openssl rand -hex 32)"
  erp_set MCP_SERVER_TOKEN "$TOKEN"
  ok "generated a new MCP_SERVER_TOKEN"
else
  ok "keeping the existing MCP_SERVER_TOKEN"
fi
if [[ "$(get_env MCP_SERVER_USER_ID "$ERP_ENV")" != "$USER_ID" ]]; then
  erp_set MCP_SERVER_USER_ID "$USER_ID"
fi

# Managers / owners: may read every report on WhatsApp. Salesmen and customers are recognised from
# the WhatsApp/Mobile number on their ERP records and need no setting here.
if [[ $MANAGER_PHONES_GIVEN -eq 1 ]]; then
  MANAGER_PHONES="$(printf '%s' "$MANAGER_PHONES" | tr ';' ',' | tr -d ' ()-')"
  [[ -z "$MANAGER_PHONES" || "$MANAGER_PHONES" =~ ^\+?[0-9]{9,15}(,\+?[0-9]{9,15})*$ ]] \
    || die "--manager-phones: give full numbers with country code, comma separated, e.g. 971501234567,971551234567"
  if [[ "$(get_env MCP_MANAGER_PHONES "$ERP_ENV")" != "$MANAGER_PHONES" ]]; then
    erp_set MCP_MANAGER_PHONES "$MANAGER_PHONES"
  fi
fi
MANAGERS_NOW="$(get_env MCP_MANAGER_PHONES "$ERP_ENV")"
if [[ -n "$MANAGERS_NOW" ]]; then
  ok "manager numbers: $(printf '%s' "$MANAGERS_NOW" | tr ',' ' ' | wc -w)"
else
  warn "no manager numbers yet: add them with --manager-phones 971501234567,971551234567"
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
  404) die "/api/mcp-server answers 404: the ERP running here does not have the MCP server code yet, or the settings did not load. Deploy the ERP build that includes it (github.com/afseerkp/BizApp365-ERP, branch main), then run this again." ;;
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
if [[ "$(get_env MCP_ALLOWED_TOOLS "$ENV_FILE")" == "$OLD_ALLOWED_TOOLS" ]]; then
  # The ERP now gives each sender only their role's tools; the old fixed list would hide the new ones.
  set_env MCP_ALLOWED_TOOLS "" "$ENV_FILE"
  ok "cleared the old MCP_ALLOWED_TOOLS list (the ERP now picks the tools per sender)"
fi
ok "MCP settings written (URL over the ERP network, token shared with the ERP)"

# Public address: <subdomain>.bizapp365.com. --subdomain wins, then the saved value, then ask.
choose_subdomain "$SUBDOMAIN"
ok "public address: https://$PUBLIC_HOST (saved as PUBLIC_SUBDOMAIN=$SUBDOMAIN in .env)"

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

PUBLIC_STATUS="$(curl -s -o /dev/null -m 10 -w '%{http_code}' "https://$PUBLIC_HOST/health" 2>/dev/null || true)"
if [[ "$PUBLIC_STATUS" == 200 ]]; then
  ok "https://$PUBLIC_HOST/health answers 200: the tunnel already reaches the bridge"
else
  warn "https://$PUBLIC_HOST/health is not reachable yet (got '${PUBLIC_STATUS:-no answer}'): add the tunnel hostname below"
fi

cat <<EOF

Done. The bridge listens on http://127.0.0.1:$PORT (this server only).
Public address: https://$PUBLIC_HOST   (change it: bash $BRIDGE_DIR/deploy.sh --subdomain <name>)

Next, if not done yet:
  1. Cloudflare Zero Trust > Networks > Tunnels > (your tunnel) > Public hostnames > Add:
       $PUBLIC_HOST  ->  HTTP  localhost:$PORT
     (if cloudflared runs in a Docker container on the ERP network, use whatsapp-bridge:$PORT instead).
     Do not put Cloudflare Access in front of it; Meta must reach it.
  2. Meta > WhatsApp > Configuration > Webhook: https://$PUBLIC_HOST/webhook, verify token from .env,
     subscribe to "messages".
  3. Test from a number in WHATSAPP_ALLOWED_NUMBERS, then clear that line and run this script again.

Logs:   docker logs -f whatsapp-bridge
Update: git -C $(cd "$BRIDGE_DIR/.." && pwd) pull --ff-only && bash $BRIDGE_DIR/deploy.sh
EOF
