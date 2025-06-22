
# Lexinator 🦖
[![CI](https://github.com/jick666/Lexinator/actions/workflows/ci.yml/badge.svg)](https://github.com/jick666/Lexinator/actions)
[![coverage ≥ 90%](https://img.shields.io/badge/coverage-90%2B-brightgreen)](./coverage)
[![npm v](https://img.shields.io/npm/v/lexinator?logo=npm)](https://www.npmjs.com/package/lexinator)

> **Note**: The repository uses Yarn as the sole package manager.

*Modular, incremental&hairsp;/&hairsp;buffered JavaScript lexer with experiment-grade plug-ability.*

---

## Features
- **Stateless Readers → Hot path speed** – every lexical rule lives in its own file, no globals.
- **Incremental & streaming modes** – tokenise as you type or as a Node stream.
- **Plugin API** – Flow, TypeScript, Stage-3 proposals, decorators… drop-in readers.
- **Diagnostics CLI** – colourised token dump, nesting depth, trivia visualiser, REPL.
- **≥ 90 % test coverage** – enforced in CI; current coverage is 100 %.
- **Bench regression guard** – fails CI if the lexer slows by > 10 %.

## Requirements

- Node.js v18 or newer
- Yarn v4

---

## Quick start

Run `yarn install` to set up dependencies (Yarn v4).

yarn add lexinator

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

## CLI

yarn diag "html`<h1>${name}</h1>`"
# or
cat file.js | node src/utils/diagnostics.js --trivia
(Run the diagnostics script directly or via `yarn diag`.)

## Incremental / buffered lexing

import { IncrementalLexer } from 'lexinator';

const inc = new IncrementalLexer({
  onToken: t => console.log(t.type, t.value.slice(0,10))
});
inc.feed('const x = 4');
inc.feed('2;');
## Plugins

import { registerPlugin, clearPlugins } from 'lexinator';
import { TypeScriptPlugin } from 'lexinator/plugins/typescript';

registerPlugin(TypeScriptPlugin);
const tsTokens = tokenize('let a: number = 1');
clearPlugins();
Authoring a plugin? See AGENTS.md → “Plugin” for the contract.

### Custom token factory

Instrument token creation by supplying `createToken` when constructing a lexer:

```javascript
import { createTokenStream } from 'lexinator';
import { Token } from 'lexinator/src/lexer/Token.js';

const seen = [];
createTokenStream('let x = 1;', {
  createToken(type, val, start, end, url) {
    const tok = new Token(type, val, start, end, url);
    seen.push(tok);
    return tok;
  }
});
```

#Project layout

#Project layout
📂 Lexinator
╠══ 📄 .eslintrc.cjs
╠══╗ 📂 .github
║  ╚══╗ 📂 workflows
║     ╠══ 📄 ci.yml
║     ╚══╗ 📂 scripts
║        ╚══ 📄 genTree.js
╠══ 📄 .gitignore
╠══╗ 📂 .husky
║  ╠══ 📄 pre-commit
║  ╚═══ 📂 ..
╠══ 📄 .releaserc
╠══╗ 📂 .yarn
║  ╚══ 📄 install-state.gz
╠══ 📄 .yarnrc.yml
╠══ 📄 AGENTS.md
╠══ 📄 commitlint.config.js
╠══╗ 📂 coverage
║  ╠══ ..
╠══╗ 📂 docs
║  ╠══ 📄 INCREMENTAL_STATE.md
║  ╠══ 📄 LEXER_SPEC.md
║  ╚══ 📄 PLUGIN_API.md
╠══ 📄 fileStructure.txt
╠══ 📄 jest.config.cjs
╠══ 📄 package.json
╠══ 📄 README.md
╠══╗ 📂 src
║  ╠══╗ 📂 grammar
║  ║  ╚══ 📄 JavaScriptGrammar.js
║  ╠══ 📄 index.js
║  ╠══╗ 📂 integration
║  ║  ╠══ 📄 BaseIncrementalLexer.js
║  ║  ╠══ 📄 BufferedIncrementalLexer.js
║  ║  ╠══ 📄 IncrementalLexer.js
║  ║  ╠══ 📄 stateUtils.js
║  ║  ╠══ 📄 TokenStream.js
║  ║  ╚══ 📄 tokenUtils.js
║  ╠══╗ 📂 lexer
║  ║  ╠══ 📄 BigIntReader.js
║  ║  ╠══ 📄 BinaryReader.js
║  ║  ╠══ 📄 BindOperatorReader.js
║  ║  ╠══ 📄 ByteOrderMarkReader.js
║  ║  ╠══ 📄 CharStream.js
║  ║  ╠══ 📄 CommentReader.js
║  ║  ╠══ 📄 DecimalLiteralReader.js
║  ║  ╠══ 📄 defaultReaders.js
║  ║  ╠══ 📄 DoExpressionReader.js
║  ║  ╠══ 📄 ExponentReader.js
║  ║  ╠══ 📄 FunctionSentReader.js
║  ║  ╠══ 📄 HexReader.js
║  ║  ╠══ 📄 HTMLCommentReader.js
║  ║  ╠══ 📄 IdentifierReader.js
║  ║  ╠══ 📄 ImportAssertionReader.js
║  ║  ╠══ 📄 ImportCallReader.js
║  ║  ╠══ 📄 ImportMetaReader.js
║  ║  ╠══ 📄 JSXReader.js
║  ║  ╠══ 📄 LexerEngine.js
║  ║  ╠══ 📄 LexerError.js
║  ║  ╠══ 📄 ModuleBlockReader.js
║  ║  ╠══ 📄 NumberReader.js
║  ║  ╠══ 📄 NumericSeparatorReader.js
║  ║  ╠══ 📄 OctalReader.js
║  ║  ╠══ 📄 OperatorReader.js
║  ║  ╠══ 📄 PatternMatchReader.js
║  ║  ╠══ 📄 PipelineOperatorReader.js
║  ║  ╠══ 📄 PrivateIdentifierReader.js
║  ║  ╠══ 📄 PunctuationReader.js
║  ║  ╠══ 📄 RadixReader.js
║  ║  ╠══ 📄 RecordAndTupleReader.js
║  ║  ╠══ 📄 RegexOrDivideReader.js
║  ║  ╠══ 📄 ShebangReader.js
║  ║  ╠══ 📄 SourceMappingURLReader.js
║  ║  ╠══ 📄 StringReader.js
║  ║  ╠══ 📄 TemplateStringReader.js
║  ║  ╠══ 📄 Token.js
║  ║  ╠══ 📄 TokenReader.js
║  ║  ╠══ 📄 UnicodeEscapeIdentifierReader.js
║  ║  ╠══ 📄 UnicodeIdentifierReader.js
║  ║  ╠══ 📄 UnicodeWhitespaceReader.js
║  ║  ╠══ 📄 UsingStatementReader.js
║  ║  ╠══ 📄 utils.js
║  ║  ╚══ 📄 WhitespaceReader.js
║  ╠══╗ 📂 plugins
║  ║  ╠══╗ 📂 common
║  ║  ║  ╠══ 📄 TSDecoratorReader.js
║  ║  ║  ╚══ 📄 TypeAnnotationReader.js
║  ║  ╠══ 📄 DecoratorPlugin.js
║  ║  ╠══╗ 📂 flow
║  ║  ║  ╚══ 📄 FlowTypePlugin.js
║  ║  ╠══╗ 📂 importmeta
║  ║  ║  ╚══ 📄 ImportMetaPlugin.js
║  ║  ╚══╗ 📂 typescript
║  ║     ╚══ 📄 TypeScriptPlugin.js
║  ╚══╗ 📂 utils
║     ╠══ 📄 checkCoverage.js
║     ╚══ 📄 diagnostics.js
╠══╗ 📂 tests
║  ╠══ 📄 BaseIncrementalLexer.test.js
║  ╠══╗ 📂 benchmarks
║  ║  ╚══ 📄 lexer.bench.js
║  ╠══ 📄 BufferedIncrementalLexer.test.js
║  ╠══ 📄 checkCoverage.test.js
║  ╠══ 📄 cli.test.js
║  ╠══ 📄 decoratorPlugin.test.js
║  ╠══ 📄 diagnostics.test.js
║  ╠══ 📄 engine.test.js
║  ╠══ 📄 errorRecovery.test.js
║  ╠══╗ 📂 fixtures
║  ║  ╠══ 📄 lexer_engine.js
║  ║  ╚══ 📄 template_string_reader.js
║  ╠══ 📄 flowTypePlugin.test.js
║  ╠══ 📄 fuzz.test.js
║  ╠══ 📄 importMetaPlugin.test.js
║  ╠══ 📄 incremental.test.js
║  ╠══ 📄 integration.test.js
║  ╠══ 📄 lexerError.test.js
║  ╠══ 📄 lexerUtils.test.js
║  ╠══ 📄 plugin.test.js
║  ╠══╗ 📂 readers
║  ║  ╠══ 📄 BigIntReader.test.js
║  ║  ╠══ 📄 BindOperatorReader.test.js
║  ║  ╠══ 📄 ByteOrderMarkReader.test.js
║  ║  ╠══ 📄 CharStream.test.js
║  ║  ╠══ 📄 CommentReader.test.js
║  ║  ╠══ 📄 DecimalLiteralReader.test.js
║  ║  ╠══ 📄 DoExpressionReader.test.js
║  ║  ╠══ 📄 ExponentReader.test.js
║  ║  ╠══ 📄 FunctionSentReader.test.js
║  ║  ╠══ 📄 HTMLCommentReader.test.js
║  ║  ╠══ 📄 IdentifierReader.test.js
║  ║  ╠══ 📄 ImportAssertionReader.test.js
║  ║  ╠══ 📄 ImportMetaReader.test.js
║  ║  ╠══ 📄 JSXReader.test.js
║  ║  ╠══ 📄 ModuleBlockReader.test.js
║  ║  ╠══ 📄 NumberReader.test.js
║  ║  ╠══ 📄 NumericSeparatorReader.test.js
║  ║  ╠══ 📄 OperatorReader.test.js
║  ║  ╠══ 📄 PatternMatchReader.test.js
║  ║  ╠══ 📄 PipelineOperatorReader.test.js
║  ║  ╠══ 📄 PrivateIdentifierReader.test.js
║  ║  ╠══ 📄 PunctuationReader.test.js
║  ║  ╠══ 📄 RadixReader.test.js
║  ║  ╠══ 📄 RecordAndTupleReader.test.js
║  ║  ╠══ 📄 RegexOrDivideReader.test.js
║  ║  ╠══ 📄 ShebangReader.test.js
║  ║  ╠══ 📄 SourceMappingURLReader.test.js
║  ║  ╠══ 📄 StringReader.test.js
║  ║  ╠══ 📄 TemplateStringReader.test.js
║  ║  ╠══ 📄 UnicodeEscapeIdentifierReader.test.js
║  ║  ╠══ 📄 UnicodeIdentifierReader.test.js
║  ║  ╠══ 📄 UnicodeWhitespaceReader.test.js
║  ║  ╠══ 📄 UsingStatementReader.test.js
║  ║  ╚══ 📄 WhitespaceReader.test.js
║  ╠══ 📄 stateUtils.test.js
║  ╠══ 📄 token.test.js
║  ╠══ 📄 tokenStream.test.js
║  ╠══ 📄 typescriptPlugin.test.js
║  ╚══╗ 📂 utils
║     ╠══ 📄 integrationCases.js
║     ╠══ 📄 readerTestUtils.js
║     ╚══ 📄 tokenTypeUtils.js
╠══ 📄 tsconfig.json
╚══ 📄 yarn.lock
