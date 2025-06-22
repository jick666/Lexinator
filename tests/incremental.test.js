import { IncrementalLexer } from '../src/integration/IncrementalLexer.js';
import { SIMPLE_DECL } from './utils/tokenTestUtils.js';

test('incremental lexer emits tokens as chunks are fed', () => {
  const types = [];
  const lexer = new IncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('let x');
  lexer.feed(' = 1;');
  expect(types).toEqual(SIMPLE_DECL);
});

test('getTokens returns accumulated tokens', () => {
  const lexer = new IncrementalLexer();
  lexer.feed('let a');
  lexer.feed(' = 2;');
  const types = lexer.getTokens().map(t => t.type);
  expect(types).toEqual(SIMPLE_DECL);
});

test('feeding whitespace only produces no tokens', () => {
  const lexer = new IncrementalLexer();
  lexer.feed('   ');
  expect(lexer.getTokens()).toEqual([]);
});

test('saveState/restoreState resumes lexing', () => {
  const lexer = new IncrementalLexer();
  lexer.feed('let x');
  const state = lexer.saveState();

  const resumed = new IncrementalLexer();
  resumed.restoreState(state);
  resumed.feed(' = 1;');

  const types = resumed.getTokens().map(t => t.type);
  expect(types).toEqual(SIMPLE_DECL);
});
