#!/bin/bash
# Global push & deploy for ALL repos in your account
# Requires: GitHub CLI (gh) and jq

GH_OWNER="AntonioLatham"  # Change if your GitHub username is different

mkdir -p repos
cd repos

# Fetch and clone/update all repos
gh repo list "$GH_OWNER" --limit 500 --json name,sshUrl,isArchived | \
jq -r '.[] | select(.isArchived|not) | [.name,.sshUrl] | @tsv' | \
while IFS=$'\t' read -r NAME SSH; do
  if [ ! -d "$NAME/.git" ]; then
    echo "📥 Cloning $NAME"
    git clone "$SSH" "$NAME"
  else
    echo "🔄 Updating $NAME"
    (cd "$NAME" && git fetch --all --prune)
  fi
done

# Commit & push in all repos
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
      git push origin "$BRANCH"
    else
      git push origin "$BRANCH" >/dev/null 2>&1 || true
      echo "  ℹ️ no local changes"
    fi
  fi
  cd ..
done

echo "✅ All repos pushed. GitHub Actions will handle deploys."
