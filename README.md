
# Lexinator 🦖
[![CI](https://github.com/jick666/Lexinator/actions/workflows/ci.yml/badge.svg)](https://github.com/jick666/Lexinator/actions)
[![coverage ≥ 90%](https://img.shields.io/badge/coverage-90%2B-brightgreen)](./coverage)
[![npm v](https://img.shields.io/npm/v/lexinator?logo=npm)](https://www.npmjs.com/package/lexinator)

*Modular, incremental&hairsp;/&hairsp;buffered JavaScript lexer with experiment-grade plug-ability.*

---

## Features
- **Stateless Readers → Hot path speed** – every lexical rule lives in its own file, no globals.
- **Incremental & streaming modes** – tokenise as you type or as a Node stream.
- **Plugin API** – Flow, TypeScript, Stage-3 proposals, decorators… drop-in readers.
- **Diagnostics CLI** – colourised token dump, nesting depth, trivia visualiser, REPL.
- **≥ 90 % test coverage** – enforced in CI; fuzz cases included.
- **Bench regression guard** – fails CI if the lexer slows by > 10 %.

---

## Quick start

Run `yarn install` to set up dependencies (Yarn v4).

npm i lexinator

import { tokenize } from 'lexinator';

const src = 'a |> b ?? 1n';
console.log(tokenize(src));
/*
[
  { type:'IDENTIFIER', value:'a', … },
  { type:'PIPELINE_OPERATOR', value:'|>', … },
  …
]
*/

#CLI

npx lexdiag "html`<h1>${name}</h1>`"
# or
cat file.js | npx lexdiag --trivia
(The lexdiag wrapper simply shells into src/utils/diagnostics.js.)

Incremental / buffered lexing

import { IncrementalLexer } from 'lexinator';

const inc = new IncrementalLexer({
  onToken: t => console.log(t.type, t.value.slice(0,10))
});
inc.feed('const x = 4');
inc.feed('2;');
Plugins

import { registerPlugin, clearPlugins } from 'lexinator';
import { TypeScriptPlugin } from 'lexinator/plugins/typescript';

registerPlugin(TypeScriptPlugin);
const tsTokens = tokenize('let a: number = 1');
clearPlugins();
Authoring a plugin? See AGENTS.md → “Plugin” for the contract.

#Project layout

📂 src
│  ├─ lexer/           // pure readers + engine
│  ├─ integration/     // incremental & buffered wrappers
│  ├─ plugins/         // Flow / TS / Decorators / …
│  └─ utils/           // diagnostics, coverage helper, file-tree script
└─ tests/              // jest + fuzz + micro-bench
