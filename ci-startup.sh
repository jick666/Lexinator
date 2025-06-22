#!/usr/bin/env bash
set -euo pipefail

echo "▶︎ CI helper starting…"

###############################################################################
# 0️⃣  Personal-Access-Token guard
###############################################################################
if [[ -z "${PAT_REPO:-}" ]]; then
  echo "❌  PAT_REPO is empty – add it in the Secrets panel" >&2
  exit 1
fi
printf '✔︎  PAT looks fine (prefix %s••••)\n' "${PAT_REPO:0:4}"

###############################################################################
# 1️⃣  cd into the repo the Codespaces-like image created
###############################################################################
REPO_DIR="/workspace/$(basename "${GITHUB_REPOSITORY:-$(pwd)}")"
cd "${REPO_DIR}" || { echo "❌  Repo dir missing"; exit 1; }
echo "→ In repo dir $PWD"

###############################################################################
# 1½️⃣  Codex proxy for npm  (local only, blown away at end)
###############################################################################
cat > .npmrc <<'EONPM'
proxy=http://localhost:8080
https-proxy=http://localhost:8080
EONPM
trap 'rm -f .npmrc' EXIT
echo "→ Wrote transient .npmrc with Codex proxy"

###############################################################################
# 2️⃣  ensure origin uses PAT (token-auth URL)
###############################################################################
REMOTE_URL="https://x-access-token:${PAT_REPO}@github.com/${GITHUB_REPOSITORY}.git"
if git remote | grep -q '^origin$'; then
  git remote set-url origin "${REMOTE_URL}"
else
  git remote add origin "${REMOTE_URL}"
fi
git ls-remote origin -q   # quick auth test

###############################################################################
# 3️⃣  Node ≥ 18
###############################################################################
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if (( NODE_MAJOR < 18 )); then
  echo "❌ Need Node 18+, have $(node -v)"
  exit 1
fi

###############################################################################
# 4️⃣  install deps – lockfile-driven, **no hooks**
###############################################################################
export HUSKY=0
echo -n "→ Installing deps via npm ci…"
if [[ -f package-lock.json ]]; then
  npm ci --no-audit --progress=false --fund=false --ignore-scripts || {
    echo -e "\n⚠️  npm ci failed once – retrying after cache clean"
    npm cache clean --force
    npm ci --no-audit --progress=false --fund=false --ignore-scripts
  }
else
  echo -e "\n⚠️  No lockfile – using npm install (hooks still off)"
  npm install --no-audit --progress=false --fund=false --ignore-scripts
fi
echo " done."

###############################################################################
# 5️⃣  project pre-flight checks
###############################################################################
npm run tree --silent
npm run diag --silent "let x = 1"

###############################################################################
# 6️⃣  lint + test + bench
###############################################################################
npm run workflow

echo "✅  Environment ready – see coverage/lcov-report/index.html"

