#!/usr/bin/env bash
#
# all-in-one-pipeline.sh
# Drops a ready-to-run GitHub Actions CI+Deploy pipeline into your repo,
# commits it, and (optionally) pushes a test branch.
#
# Usage:
#   bash all-in-one-pipeline.sh [--push]
#
# Before first deploy:
#   In GitHub → Settings → Secrets and variables → Actions, add:
#     - API_TOKEN    : your deploy platform token (Replit/Vercel/Render/etc.)
#     - DEPLOY_TARGET: webhook/endpoint/CLI target for deployment
#     - DEPLOY_URL   : public URL of your app for health checks
#
set -euo pipefail

# Ensure we're at the repo root
if [ ! -d ".git" ]; then
  echo "❌ This doesn't look like a Git repo (no .git folder). Run inside your project root."
  exit 1
fi

# Create directories
mkdir -p .github/workflows
mkdir -p scripts
mkdir -p .ci

# Write workflow
cat > .github/workflows/ci.yml <<'YAML'
name: CI & Deploy

on:
  push:
    branches: ["**"]
  workflow_dispatch:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests (if any)
        run: npm test --if-present

      - name: Build (if any)
        run: npm run build --if-present

      - name: Archive build artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: |
            build
            dist
            .next
            out
            package.json
          if-no-files-found: ignore

  deploy:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: build_artifacts

      - name: Checkout repo (for scripts)
        uses: actions/checkout@v4

      - name: Deploy
        env:
          DEPLOY_TARGET: ${{ secrets.DEPLOY_TARGET }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
          DEPLOY_URL: ${{ secrets.DEPLOY_URL }}
        run: bash scripts/deploy.sh
YAML

# Write deploy script
cat > scripts/deploy.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail

echo "==> Starting deploy at $(date -u)"
echo "DEPLOY_TARGET: ${DEPLOY_TARGET:-<unset>}"
echo "DEPLOY_URL: ${DEPLOY_URL:-<unset>}"

# TODO: Replace this section with your real platform command or webhook call.
# Examples:
#   # Vercel (requires VERCEL_TOKEN as API_TOKEN, and vercel.json configured)
#   npx vercel --prod --token "$API_TOKEN"
#
#   # Render/Netlify build hooks:
#   curl -X POST -H "Authorization: Bearer $API_TOKEN" "$DEPLOY_TARGET"
#
#   # Replit Deployments webhook:
#   curl -X POST -H "Authorization: Bearer $API_TOKEN" "$DEPLOY_TARGET"     #        -H "Content-Type: application/json"     #        -d '{"ref":"main","artifact_path":"build_artifacts"}'

if [ -z "${API_TOKEN:-}" ] || [ -z "${DEPLOY_TARGET:-}" ]; then
  echo "::warning::API_TOKEN or DEPLOY_TARGET not set. Skipping actual deploy."
else
  echo "Pretending to deploy artifacts from $(pwd)/build_artifacts to $DEPLOY_TARGET"
  # Insert real deploy command above.
fi

echo "==> Deploy step done."
BASH
chmod +x scripts/deploy.sh

# Healthcheck marker file for a harmless commit
echo "$(date -u) - pipeline check" > .ci/pipeline-check.txt

# Documentation
cat > PIPELINE_HEALTHCHECK.md <<'MD'
# Pipeline Healthcheck

This repo contains a ready-to-run GitHub Actions pipeline:
- CI on every push
- Deploy on pushes to `main`

## Setup
1. Add GitHub Action **secrets**:
   - `API_TOKEN` – your deploy platform token.
   - `DEPLOY_TARGET` – deploy webhook/endpoint or CLI target.
   - `DEPLOY_URL` – public URL of your app.
2. Commit and push a test branch to see CI run.
3. Merge to `main` to see the deploy job run.

## Post-deploy checks
```bash
curl -I "$DEPLOY_URL"
curl "$DEPLOY_URL/__health" || true
curl "$DEPLOY_URL/__version" || true
```
MD

# Git add/commit
git add .github/workflows/ci.yml scripts/deploy.sh .ci/pipeline-check.txt PIPELINE_HEALTHCHECK.md

if ! git diff --cached --quiet; then
  git commit -m "chore: add all-in-one CI & deploy pipeline"
else
  echo "ℹ️ Nothing to commit."
fi

# Optional push
if [ "${1:-}" = "--push" ]; then
  branch="pipeline-test/$(date -u +%Y%m%d%H%M%S)"
  git checkout -b "$branch" 2>/dev/null || git checkout "$branch"
  git push -u origin HEAD
  echo "✅ Pushed $branch. Open the Actions tab to watch the run."
else
  echo "✅ Files written and committed locally. Run with '--push' to push a test branch."
fi
