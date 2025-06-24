import fc from "fast-check";
import { BufferedIncrementalLexer } from "../src/integration/BufferedIncrementalLexer.js";

function reconstruct(tokens) {
  let out = '';
  for (const t of tokens) {
    if (t.leadingTrivia) out += t.leadingTrivia.map(x => x.value).join('');
    out += t.value;
    if (t.trailingTrivia) out += t.trailingTrivia.map(x => x.value).join('');
  }
  return out;
}

describe('property fuzz', () => {
  test('roundtrip tokenize → join', () => {
    fc.assert(
      fc.property(
        fc.string()
          .filter(s => /^[a-zA-Z0-9 ]+$/.test(s) && /[a-zA-Z0-9]/.test(s))
          .filter(s => !s.endsWith(' ')),
        str => {
        const lex = new BufferedIncrementalLexer();
        lex.feed(str);
        const tokens = lex.getTokens();
        expect(reconstruct(tokens)).toBe(str);
      }),
      { numRuns: 50 }
    );
  });

  test('save/restore yields same tokens', () => {
    fc.assert(
      fc.property(
        fc.string()
          .filter(s => /^[a-zA-Z0-9 ]+$/.test(s) && /[a-zA-Z0-9]/.test(s))
          .filter(s => !s.endsWith(' ')),
        str => {
        const lex = new BufferedIncrementalLexer();
        lex.feed(str);
        const tokens = lex.getTokens();
        const state = lex.saveState();

        const resumed = new BufferedIncrementalLexer();
        resumed.restoreState(state);
        const rTokens = resumed.getTokens();
        expect(rTokens.map(t => t.type)).toEqual(tokens.map(t => t.type));
        expect(rTokens.map(t => t.value)).toEqual(tokens.map(t => t.value));
      }),
      { numRuns: 50 }
    );
  });
});
