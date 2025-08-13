#!/usr/bin/env bash
set -euo pipefail

# === Vercel Deploy Script ===
# Requires these GitHub Actions secrets:
#   VERCEL_TOKEN     – from Vercel Account Settings → Tokens
#   VERCEL_ORG_ID    – from Vercel org settings (ID)
#   VERCEL_PROJECT_ID – from Vercel project settings (ID)
# Optional:
#   DEPLOY_URL – production URL for health checks

echo "==> Vercel deploy starting at $(date -u)"

# Pull Vercel project settings into the build
npx vercel pull --yes --environment=production \
  --token "${VERCEL_TOKEN}"

# Build the project
npx vercel build --prod \
  --token "${VERCEL_TOKEN}"

# Deploy the prebuilt output
URL=$(npx vercel deploy --prebuilt --prod \
  --token "${VERCEL_TOKEN}" \
  --scope "${VERCEL_ORG_ID}")

echo "==> Deployed to: ${URL}"

# Health checks (optional)
if [ -n "${DEPLOY_URL:-}" ]; then
  echo "==> Checking health for ${DEPLOY_URL}"
  curl -I --max-time 10 "${DEPLOY_URL}" || true
  curl --max-time 10 "${DEPLOY_URL}/__health" || true
  curl --max-time 10 "${DEPLOY_URL}/__version" || true
fi

echo "==> Vercel deploy finished."
