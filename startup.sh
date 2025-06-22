#!/usr/bin/env bash
set -euo pipefail

echo "▶︎ CI helper starting…"

# Personal Access Token guard
if [[ -z "${PAT_REPO:-}" ]]; then
  echo "❌  PAT_REPO is empty – add it in the Secrets panel" >&2
  exit 1
fi
echo "✔︎  PAT looks fine (prefix ${PAT_REPO:0:4}••••)"

# cd into repo (Codespaces-like image)
REPO_DIR="/workspace/$(basename "${GITHUB_REPOSITORY:-$(pwd)}")"
cd "${REPO_DIR}" || { echo "❌  Repo dir missing"; exit 1; }
echo "→ In repo dir $PWD"

# Codex proxy for npm (local only, removed at exit)
trap 'rm -f .npmrc' EXIT
cat > .npmrc <<'EONPM'
proxy=http://localhost:8080
https-proxy=http://localhost:8080
EONPM
echo "→ Wrote transient .npmrc with Codex proxy"

# ensure origin uses PAT
REMOTE_URL="https://x-access-token:${PAT_REPO}@github.com/${GITHUB_REPOSITORY}.git"
if git remote | grep -q '^origin$'; then
  git remote set-url origin "${REMOTE_URL}"
else
  git remote add origin "${REMOTE_URL}"
fi
git ls-remote origin -q  # quick auth test

# Node >= 18
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
(( NODE_MAJOR < 18 )) && { echo "❌ Need Node 18+, have $(node -v)"; exit 1; }

# install deps
export HUSKY=0
echo -n "→ Installing deps…"
if [[ -f yarn.lock ]]; then
  if ! yarn install --immutable --inline-builds; then
    echo -e "\n⚠️  yarn failed – retrying after cache clean"
    yarn cache clean
    yarn install --immutable --inline-builds
  fi
elif [[ -f package-lock.json ]]; then
  if ! npm ci --no-audit --progress=false --fund=false --ignore-scripts; then
    echo -e "\n⚠️  npm ci failed once – retrying after cache clean"
    npm cache clean --force
    npm ci --no-audit --progress=false --fund=false --ignore-scripts
  fi
else
  npm install --no-audit --progress=false --fund=false --ignore-scripts
fi
echo " done."

# lint + test + coverage
echo "→ Running ESLint…"
npm run lint --if-present

echo "→ Running tests…"
npm test -- --coverage

echo "✅  Environment ready – see coverage/lcov-report/index.html"
