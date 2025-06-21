import { BaseIncrementalLexer } from '../src/integration/BaseIncrementalLexer.js';

test('emit stores token and calls callback', () => {
  const seen = [];
  const lex = new BaseIncrementalLexer({ onToken: t => seen.push(t) });
  const tok = { type: 'IDENTIFIER', value: 'x' };
  lex.emit(tok);
  expect(lex.getTokens()).toEqual([tok]);
  expect(seen).toEqual([tok]);
});
