# Persisting Incremental Lexer State

Both `IncrementalLexer` and `BufferedIncrementalLexer` can save their internal state so lexing can be resumed later. This is useful for editor sessions or long-running processes where re-tokenizing from the beginning would be wasteful.

## Saving State

Call `saveState()` on a lexer instance to obtain a serializable object:


const lexer = new IncrementalLexer();
lexer.feed('let x');
const state = lexer.saveState();
// persist `state` to disk or elsewhere


## Restoring State

Create a new lexer and call `restoreState(state)` with a previously saved snapshot:


const resumed = new IncrementalLexer();
resumed.restoreState(state);
resumed.feed(' = 1;');
console.log(resumed.getTokens().map(t => t.type));
// ['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'NUMBER', 'PUNCTUATION']


`BufferedIncrementalLexer` exposes the same API and will resume buffered tokens as expected.
