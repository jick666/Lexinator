#!/usr/bin/env bash
set -euo pipefail

info(){ echo "[startup] $1"; }

###############################################################################
# 0️⃣  Personal-Access-Token guard
###############################################################################
if [[ -z "${PAT_REPO:-}" ]]; then
  echo "❌  PAT_REPO is empty – add it in the Secrets panel" >&2
  exit 1
fi
info "PAT looks fine (prefix ${PAT_REPO:0:4}••••)"

###############################################################################
# 1️⃣  cd into the repo the Codespaces-like image created
###############################################################################
REPO_DIR="/workspace/$(basename "${GITHUB_REPOSITORY:-$(pwd)}")"
cd "${REPO_DIR}" || { echo "❌  Repo dir missing"; exit 1; }
info "In repo dir $PWD"

###############################################################################
# 1½️⃣  Codex proxy for npm (local only)
###############################################################################
cat > .npmrc <<'EONPM'
proxy=http://localhost:8080
https-proxy=http://localhost:8080
EONPM
info "Wrote transient .npmrc with Codex proxy"
trap 'rm -f .npmrc' EXIT

###############################################################################
# 2️⃣  ensure origin uses PAT (token-auth URL)
###############################################################################
REMOTE_URL="https://x-access-token:${PAT_REPO}@github.com/${GITHUB_REPOSITORY}.git"
if git remote | grep -q '^origin$'; then
  git remote set-url origin "${REMOTE_URL}"
else
  git remote add origin "${REMOTE_URL}"
fi
git ls-remote origin -q

###############################################################################
# 3️⃣  Node ≥ 18
###############################################################################
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if (( NODE_MAJOR < 18 )); then
  echo "❌ Need Node 18+, have $(node -v)" >&2
  exit 1
fi

###############################################################################
# 4️⃣  install deps – lockfile-driven, hooks disabled
###############################################################################
export HUSKY=0
if [[ -f yarn.lock ]]; then
  info "Installing deps via yarn --immutable";
  yarn install --immutable || yarn install
elif [[ -f package-lock.json ]]; then
  info "Installing deps via npm ci";
  npm ci --no-audit --progress=false --fund=false --ignore-scripts || {
    info "npm ci failed – retrying after cache clean";
    npm cache clean --force;
    npm ci --no-audit --progress=false --fund=false --ignore-scripts;
  }
else
  info "No lockfile – running npm install";
  npm install --no-audit --progress=false --fund=false --ignore-scripts;
fi

###############################################################################
# 5️⃣  lint + test + coverage via workflow
###############################################################################
info "Running lint, tests and benchmarks";
npm run workflow
info "Environment ready – see coverage/lcov-report/index.html"
