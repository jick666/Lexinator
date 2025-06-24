# Lexinator 🦎
[![CI](https://github.com/jick666/Lexinator/actions/workflows/ci.yml/badge.svg)](…)
[![Coverage ≥ 100 %](https://img.shields.io/badge/coverage-100%25-brightgreen)](…)
[![npm](https://img.shields.io/npm/v/lexinator)](https://www.npmjs.com/package/lexinator)
![license](https://img.shields.io/github/license/jick666/Lexinator)

Modular, **incremental JavaScript lexer** with experiment-grade plug-ability and 100 % coverage.

---

## ✨ Highlights
| Feature | Why it matters |
|---------|----------------|
| **Stateless readers** | Hot-path speed – each rule self-contained, no globals |
| **Incremental & streaming** | Tokenise *as you type* or as a Node stream |
| **Plugin API** | Flow / TS / stage-3 proposals as drop-ins |
| **Diagnostics CLI** | Colourised token dump, nesting depth, trivia visualiser, REPL |
| **Perf & quality gates** | CI fails if coverage < 90 % or lexer slows by > 10 % |

---

## 🚀 Quick start

corepack enable   # if Yarn isn't global
yarn install      # Yarn 4
yarn add lexinator

node - <<'JS'
import { tokenize } from 'lexinator';
console.log(tokenize('a |> b ?? 1n'));
JS
CLI

yarn diag "html\`<h1>${name}</h1>\`"
cat file.js | yarn diag --trivia
🧩 Plugins

import { registerPlugin, clearPlugins } from 'lexinator';
import { TypeScriptPlugin } from 'lexinator/plugins/typescript';

registerPlugin(TypeScriptPlugin);
const tokens = tokenize('let a: number = 1');
clearPlugins();
See docs/PLUGIN_API.md for contract details.

🛠 Development scripts

yarn lint       # ESLint everywhere
yarn test       # Jest w/ coverage
yarn workflow   # lint ➜ test ➜ bench guard
yarn tree       # regenerate fileStructure.txt
🗂 Project layout (top-level)

.github/workflows   CI + benchmark guard
docs/               Incremental state, spec, plugin API
src/                Lexer engine + readers + plugins
tests/              600+ Jest cases & benches
AGENTS.md           Agent operating manual
🤝 Contributing
Fork & branch.

yarn workflow must pass.

Follow commit-lint (feat|fix|perf|refactor(scope): message).

Open a PR – CI + benchmark guard will gate.

📜 License
MIT © 2025 James Lewis
