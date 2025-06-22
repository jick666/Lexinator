import { IncrementalLexer } from '../src/integration/IncrementalLexer.js';
import { createLexerCollector, getTokenTypes } from './utils/lexerTestUtils.js';

test('incremental lexer emits tokens as chunks are fed', () => {
  const { lexer, types } = createLexerCollector(IncrementalLexer);
  lexer.feed('let x');
  lexer.feed(' = 1;');
  expect(types).toEqual([
    'KEYWORD',
    'IDENTIFIER',
    'OPERATOR',
    'NUMBER',
    'PUNCTUATION'
  ]);
});

test('getTokens returns accumulated tokens', () => {
  const { lexer } = createLexerCollector(IncrementalLexer);
  lexer.feed('let a');
  lexer.feed(' = 2;');
  const types = getTokenTypes(lexer);
  expect(types).toEqual([
    'KEYWORD',
    'IDENTIFIER',
    'OPERATOR',
    'NUMBER',
    'PUNCTUATION'
  ]);
});

test('feeding whitespace only produces no tokens', () => {
  const { lexer } = createLexerCollector(IncrementalLexer);
  lexer.feed('   ');
  expect(getTokenTypes(lexer)).toEqual([]);
});

test('saveState/restoreState resumes lexing', () => {
  const { lexer } = createLexerCollector(IncrementalLexer);
  lexer.feed('let x');
  const state = lexer.saveState();

  const { lexer: resumed } = createLexerCollector(IncrementalLexer);
  resumed.restoreState(state);
  resumed.feed(' = 1;');

  const types = getTokenTypes(resumed);
  expect(types).toEqual([
    'KEYWORD',
    'IDENTIFIER',
    'OPERATOR',
    'NUMBER',
    'PUNCTUATION'
  ]);
});
