import { expect, test } from '@jest/globals';
import { BaseIncrementalLexer } from '../src/integration/BaseIncrementalLexer.js';
import { Token } from '../src/lexer/Token.js';

test('emit stores token and calls callback', () => {
  const seen: Token[] = [];
  const lex = new BaseIncrementalLexer({ onToken: t => seen.push(t) });
  const tok = new Token('IDENTIFIER', 'x', { index: 0 } as any, { index: 1 } as any);
  lex.emit(tok);
  expect(lex.getTokens()).toEqual([tok]);
  expect(seen).toEqual([tok]);
});
