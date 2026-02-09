#!/bin/sh
# ──────────────────────────────────────────────────────────────────────────────
# Runtime Environment Injection for Next.js Standalone
# ──────────────────────────────────────────────────────────────────────────────
# Next.js inlines NEXT_PUBLIC_* vars at BUILD time into the JS bundle.
# This script injects them at RUNTIME so K8s ConfigMaps / env vars work.
#
# It writes a JS file that sets window.__NEXT_PUBLIC_ENV, which is picked up
# by lib/utils/constants.ts on the client side.
# ──────────────────────────────────────────────────────────────────────────────

ENV_FILE="/app/public/__ENV.js"

# Collect all NEXT_PUBLIC_* env vars into a JSON object
echo "window.__ENV = {" > "$ENV_FILE"

# Loop through all environment variables starting with NEXT_PUBLIC_
env | grep '^NEXT_PUBLIC_' | while IFS='=' read -r name value; do
  echo "  \"$name\": \"$value\"," >> "$ENV_FILE"
done

echo "};" >> "$ENV_FILE"

echo "[entrypoint] Runtime env written to $ENV_FILE"
cat "$ENV_FILE"

# Start the Next.js server
exec node server.js
