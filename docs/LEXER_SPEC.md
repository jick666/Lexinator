# Lexer Specification

This document defines the architecture and requirements for the experimental JavaScript lexer.

## 1. CharStream <a name="charstream"></a>
- Provides character-level access  
- Methods: `current()`, `peek(offset)`, `advance()`, `eof()`, `getPosition()`

## 2. Token <a name="token"></a>
- Rich object: `type`, `value`, `start`, `end`, `toJSON()`

## 3. LexerEngine <a name="lexerengine"></a>
- Manages `stateStack`, `lookahead`
- Provides `peek(n)` for token lookahead
- Dispatches to token readers per `stateStack` top

## 4. Token Readers <a name="readers"></a>
Each is a pure function `(stream, factory) => Token|null`:
- `IdentifierReader` (§4.1)
- `NumberReader` (§4.2)
- `HexReader` (§4.3)
- `BigIntReader` (§4.4)
- `OperatorReader` (§4.5)
- `PunctuationReader` (§4.6)
- `RegexOrDivideReader` (§4.7)
- `TemplateStringReader` (§4.8)
- `WhitespaceReader` (§4.9)
- `CommentReader` (§4.10)
- `StringReader` (§4.11)
- `JSXReader` (§4.12)

## 5. Modes <a name="modes"></a>
- `default`, `template_string`, `regex`, `jsx`, etc.

## 6. Token Format <a name="format"></a>
- `type`: `IDENTIFIER`, `NUMBER`, `COMMENT`, …  
- `value`: lexeme  
- `start`/`end`: `{ line, column, index }`  
- `raw`: original text (optional)  
- `trivia`: leading/trailing comments/whitespace  

## 7. Performance Targets <a name="perf"></a>
- Startup < 5 ms (< 1 k lines)  
- Full-file ≤ 100 ms (100 k lines)  
- Support lookahead & incremental lex  

## 8. Testing & CI <a name="ci"></a>
- Unit tests: `tests/readers/*.test.js`  
- Integration tests: `tests/integration.test.js`  
- ESLint rules + JSDoc  
- Jest coverage ≥ 90%  
- GitHub Actions CI  

## 9. Extensibility <a name="ext"></a>
- Grammar definitions: `src/grammar/JavaScriptGrammar.js`
- Agent prompts: `.codex/promptMap.json`

## 10. Edge Cases & Error Handling <a name="edge"></a>
- Unterminated regex literals yield a `LexerError` of type `UnterminatedRegex`.
- Unterminated template literals yield a `LexerError` of type `UnterminatedTemplate`.
- Bad escape sequences inside template strings produce a `LexerError` of type `BadEscape`.
- Multi-line comments reaching EOF are returned as `COMMENT` tokens without error.
- `/=` is always tokenized as the divide-assign operator before regex detection.
- Regex or divide context is inferred from the last non-whitespace character.
- Character classes inside regex literals are parsed, ignoring `/` characters
  until the closing `]`.
- Named capture groups using the syntax `(?<name>...)` are recognized. Capture
  group names must follow identifier rules (letters, digits, underscore) and
  invalid names cause the lexer to emit an `INVALID_REGEX` token.
- Unicode property escapes using `\p{}` and `\P{}` are validated against
  canonical Unicode property names and values. Unknown properties result
  in an `INVALID_REGEX` token.
- When the `v` flag is present, nested Unicode sets like `[\p{Script=Latin}--[a-z]]`
  are tokenized correctly with balanced bracket tracking.
- Template strings track nested `${ ... }` braces and handle escapes.
- `HTML_TEMPLATE_STRING` tokens are returned for `html`-tagged templates.
- `NumberReader` only parses base‑10 integers and decimals.
- `BigIntReader` parses integer literals with a trailing `n`.
- `DecimalLiteralReader` parses decimal literals like `123.4m` or `0d123.4`.
- `UsingStatementReader` recognizes `using` and `await using` statements.
- `HexReader` parses `0x` or `0X` prefixed hexadecimal integers.
- `OctalReader` parses `0o` or `0O` prefixed octal integers.
- `ExponentReader` parses numbers with `e` or `E` exponents.
- `UnicodeIdentifierReader` reads identifiers starting with non-ASCII Unicode characters.
- `UnicodeEscapeIdentifierReader` reads identifiers containing Unicode escape sequences like `\u{1F600}`.
- `ByteOrderMarkReader` handles a leading `\uFEFF` byte order mark and emits a `BOM` token.
- `ShebangReader` consumes `#!` headers at the start of a file as `COMMENT` tokens.
- `SourceMappingURLReader` recognizes `//# sourceMappingURL=` comments and emits a `SOURCE_MAPPING_URL` token with the mapping value.
- `StringReader` parses single- or double-quoted strings with escapes and errors on unterminated input.
- `JSXReader` tokenizes raw JSX elements between `<` and `>`.
- `JSXReader` ignores `<` inside `{}` expressions and supports self-closing tags.
- When `errorRecovery` is enabled, malformed sequences emit `ERROR_TOKEN` placeholders instead of throwing.

## 11. Usage Examples <a name="examples"></a>
Run the CLI directly after building:
```bash
node dist/index.js "let x = 5;" --verbose
```
This prints each token and returns an array like:
`[KEYWORD, IDENTIFIER, OPERATOR, NUMBER, PUNCTUATION]`.

Programmatic usage via the exported `tokenize` function:
```javascript
import { tokenize } from "./index.ts";
const tokens = tokenize("const a = /re/g;");
```
`tokens` is an array of `Token` objects. Setting `{ verbose: true }` logs tokens as they are produced. Custom readers may be added by pushing to `LexerEngine.modes.default` before tokenization.

### Streaming Tokens for Syntax Highlighting

The `createTokenStream` helper in `src/integration` returns a Node.js `Readable`
that emits each token object. This is useful for editor integrations that rely
on streaming lexers.

```javascript
import { createTokenStream } from '../index.ts';
const stream = createTokenStream('let x = 1;');
stream.on('data', token => {
  console.log(token.type);
});
```

## 12. Plugin API <a name="plugin"></a>
Plugins extend the lexer with additional readers. Register them via
`registerPlugin` before creating a lexer instance.

```javascript
import { registerPlugin } from '../src/pluginManager.ts';
import { HashPlugin } from './hash-plugin.js';

registerPlugin(HashPlugin);
```

Plugins may provide readers for any mode using a `modes` map and an optional
`init(engine)` hook. See `docs/PLUGIN_API.md` for a full example.

## 13. Pipeline Operator <a name="pipeline"></a>
The experimental lexer will recognize the pipeline operator `|>` as a distinct `PIPELINE_OPERATOR` token. This reader should emit the token when the `|>` sequence is encountered in default mode. Future versions may support additional pipeline styles.

Example tokenization:

```
a |> b
```

produces the tokens `[IDENTIFIER("a"), PIPELINE_OPERATOR("|>"), IDENTIFIER("b")]`.

## 14. Bind Operator <a name="bind"></a>
The bind operator `::` allows convenient method extraction without losing the
object context. When the lexer encounters the sequence `::` it emits a distinct
`BIND_OPERATOR` token.

Example:

```
obj::method
```

produces the tokens `[IDENTIFIER("obj"), BIND_OPERATOR("::"), IDENTIFIER("method")]`.

## 15. Do Expressions <a name="do-expressions"></a>
Do expressions allow block scoped evaluation returning the last statement value. When the lexer encounters the keyword `do` followed by an opening brace, it emits a `DO_BLOCK_START` token and pushes a `do_block` mode on the state stack. The body of the block is tokenized normally. Each closing brace decrements an internal counter and when the matching brace is reached a `DO_BLOCK_END` token is emitted and the mode is popped. Nested `do` blocks are therefore handled correctly.

Example:

```
do { 1 + 2 }
```

produces the tokens `[DO_BLOCK_START("do {"), NUMBER("1"), OPERATOR("+"), NUMBER("2"), DO_BLOCK_END("}")]`.

## 16. Private Identifiers <a name="private-identifiers"></a>
Private class fields and methods begin with a `#` prefix. When the lexer
encounters `#` followed by an identifier, it emits a `PRIVATE_IDENTIFIER`
token containing the full sequence including the hash.

Example:

```
class C { #field; #method() {} }
```

produces the tokens `[
  KEYWORD("class"), IDENTIFIER("C"), PUNCTUATION("{"),
  PRIVATE_IDENTIFIER("#field"), PUNCTUATION(";"),
  PRIVATE_IDENTIFIER("#method"), PUNCTUATION("("), PUNCTUATION(")"),
  PUNCTUATION("{"), PUNCTUATION("}"), PUNCTUATION("}")
]`.

## 17. Import Assertions <a name="import-assertions"></a>
Import statements may include an `assert` clause to provide metadata about the
module being imported. The lexer recognizes the sequence `assert { ... }` (or
`assert: { ... }` inside dynamic import options) as a single
`IMPORT_ASSERTION` token containing the entire clause.

Example:

```
import data from "./d.json" assert { type: "json" };
```

produces the tokens `[
  KEYWORD("import"), IDENTIFIER("data"), IDENTIFIER("from"),
  STRING("./d.json"), IMPORT_ASSERTION("assert { type: \"json\" }"),
  PUNCTUATION(";")
]`.

## 18. Record and Tuple Literals <a name="record-tuple"></a>
Record (`#{}`) and tuple (`#[ ]`) literals start with `#` followed by
`{` or `[`.
When these sequences are encountered, the lexer emits a `RECORD_START`
or `TUPLE_START` token. The closing delimiters are the normal `}` and
`]` punctuation tokens.

Example:

```
#{ a: 1 }
#[1]
```

produces the tokens `[
  RECORD_START("#{"), IDENTIFIER("a"), NUMBER("1"), PUNCTUATION("}"),
  TUPLE_START("#["), NUMBER("1"), PUNCTUATION("]")
]`.

## 19. HTML Comments <a name="html-comments"></a>
When `<!--` or `-->` appears at the start of a line, it is treated like a
single-line comment. The lexer consumes the rest of the line and emits a
`COMMENT` token containing the text of the comment.

Example:

```
<!-- hidden -->
let x = 1;
```

produces the tokens `[
  COMMENT("<!-- hidden -->"), WHITESPACE("\n"), KEYWORD("let"), IDENTIFIER("x"),
  OPERATOR("="), NUMBER("1"), PUNCTUATION(";")
]`.

## 20. Module Blocks <a name="module-blocks"></a>
Module blocks start with the keyword `module` followed by an opening brace.
When this sequence is encountered the lexer emits a `MODULE_BLOCK_START` token
and pushes a `module_block` mode. Braces inside the block increment and
 decrement an internal counter so nested blocks are supported. When the
matching closing brace is reached a `MODULE_BLOCK_END` token is emitted and the
mode is popped.

Example:

```javascript
module { let x = 1; }
```

produces the tokens `[
  MODULE_BLOCK_START("module {"), KEYWORD("let"), IDENTIFIER("x"),
  OPERATOR("="), NUMBER("1"), PUNCTUATION(";"), MODULE_BLOCK_END("}")
]`.

## 21. Explicit Resource Management <a name="using"></a>
The lexer recognizes the experimental `using` declarations for managing
resources. When the keyword `using` appears at the start of a statement it
emits a `USING` token. If the sequence is preceded by `await` separated by
whitespace, the lexer emits an `AWAIT_USING` token containing the whole
`await using` text.

Example:

```javascript
using file = open();
await using conn = connect();
```

produces the tokens `[
  USING("using"), IDENTIFIER("file"),
  AWAIT_USING("await using"), IDENTIFIER("conn"),
  ...
]`.

## 22. Pattern Matching <a name="pattern-matching"></a>
The lexer reserves the keywords `match` and `case` for future pattern
matching support. When these words appear at statement boundaries they
are emitted as `MATCH` and `CASE` tokens respectively.

Example:

```javascript
match (x) { case 1: }
```

produces the tokens `[
  MATCH("match"), PUNCTUATION("("), IDENTIFIER("x"), PUNCTUATION(")"),
  PUNCTUATION("{"), CASE("case"), NUMBER("1"), PUNCTUATION(":"),
  PUNCTUATION("}")
]`.

## 23. Function.sent <a name="function-sent"></a>
Generator functions may access the `function.sent` meta property to
retrieve the value supplied by the most recent `next()` call. When the
lexer encounters the exact sequence `function.sent` it emits a
`FUNCTION_SENT` token.

Example:

```javascript
function.sent;
```

produces the tokens `[
  FUNCTION_SENT("function.sent"), PUNCTUATION(";")
]`.

## 24. Byte Order Mark <a name="bom"></a>
If a file begins with the Unicode byte order mark (`\uFEFF`), the lexer emits a
`BOM` token and advances past it before processing the rest of the input. The
token's value is the literal BOM character.

## 25. Source Mapping Comments <a name="source-maps"></a>
Comments of the form `//# sourceMappingURL=...` or `/*# sourceMappingURL=... */`
are consumed by `SourceMappingURLReader`. The lexer emits a
`SOURCE_MAPPING_URL` token whose value is the provided mapping URL. Both
external map references and inline data URIs are supported.


## 26. Unicode Whitespace <a name="unicode-whitespace"></a>
The `UnicodeWhitespaceReader` groups any character with the Unicode `White_Space`
property into a single `WHITESPACE` token. Consecutive characters—including
rare spaces such as `\u2003` (EM SPACE) and `\u205F` (MEDIUM MATHEMATICAL
SPACE)—are consumed together, and the token's value preserves the original
characters.

## 27. Error Recovery Mode <a name="error-recovery"></a>
Passing `{ errorRecovery: true }` to the lexer causes malformed sequences to be
replaced with `ERROR_TOKEN` placeholders instead of throwing a `LexerError`.
Lexing then resumes after the offending text.

Example:

```javascript
"abc
let x = 1;
```

produces the tokens `[
  ERROR_TOKEN("\"abc"), WHITESPACE("\n"), KEYWORD("let"), IDENTIFIER("x"),
  OPERATOR("="), NUMBER("1"), PUNCTUATION(";")
]`.
