import fc from 'fast-check';
import { IncrementalLexer } from '../src/integration/IncrementalLexer.js';

function tokenTypes(tokens) {
  return tokens.map(t => t.type);
}

describe('incremental lexer state roundtrip', () => {
  test('save/restore reproduces tokens', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('a','b','c',' ','=','1','2','3',';'), { maxLength: 20 }).map(a => a.join('')),
        (code) => {
          const lexer = new IncrementalLexer({ errorRecovery: true });
          lexer.feed(code);
          const baseline = tokenTypes(lexer.getTokens());
          const state = lexer.saveState();
          const restored = new IncrementalLexer({ errorRecovery: true });
          restored.restoreState(state, false, { input: code });
          expect(tokenTypes(restored.getTokens())).toEqual(baseline);
        }
      ),
      { numRuns: 25 }
    );
  });
});
