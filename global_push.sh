#!/bin/bash
# Global push & deploy for ALL repos in your account
# First time only (in Codespaces or local): gh auth login  |  install jq if asked

GH_OWNER="AntonioLatham"  # ← change if your GitHub username/org is different

mkdir -p repos
cd repos

# 1) Fetch list of all non‑archived repos and clone any missing
gh repo list "$GH_OWNER" --limit 500 --json name,sshUrl,isArchived | \
jq -r '.[] | select(.isArchived|not) | [.name,.sshUrl] | @tsv' | \
while IFS=$'\t' read -r NAME SSH; do
  if [ ! -d "$NAME/.git" ]; then
    echo "📥 Cloning $NAME"
    git clone "$SSH" "$NAME" || echo "⚠️ Clone failed for $NAME"
  else
    echo "🔄 Updating $NAME"
    (cd "$NAME" && git fetch --all --prune)
  fi
done

# 2) For each repo: pull, then commit & push if there are changes (or push anyway to trigger deploy)
find . -maxdepth 1 -type d ! -path . | while read -r DIR; do
  cd "$DIR"
  if [ -d .git ]; then
    echo "🚀 $DIR"
    BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
    git checkout "$BRANCH" >/dev/null 2>&1 || true
    git pull --rebase origin "$BRANCH" >/dev/null 2>&1 || true

    if [ -n "$(git status --porcelain)" ]; then
      git add -A
      git commit -m "update"
      git push origin "$BRANCH" || echo "❌ Push failed for $DIR"
    else
      git push origin "$BRANCH" >/dev/null 2>&1 || true
      echo "  ℹ️ no local changes"
    fi
  fi
  cd ..
done

echo "✅ All repos pushed. Each repo's GitHub Actions/Pages will deploy where configured."

sudo apt-get update && sudo apt-get install -y jq gh
gh auth login   # choose GitHub.com → HTTPS → open browser to approve
chmod +x push_all.sh
./push_all.sh
