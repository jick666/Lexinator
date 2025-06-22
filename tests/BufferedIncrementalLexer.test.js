import { BufferedIncrementalLexer } from '../src/integration/BufferedIncrementalLexer.js';
import { createLexerCollector, getTokenTypes } from './utils/lexerTestUtils.js';

test('buffers incomplete string across feeds', () => {
  const { lexer, types } = createLexerCollector(BufferedIncrementalLexer);
  lexer.feed('const s = "hel');
  expect(types).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR']);
  lexer.feed('lo";');
  expect(types).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'STRING', 'PUNCTUATION']);
});

test('getTokens includes buffered results only when complete', () => {
  const { lexer } = createLexerCollector(BufferedIncrementalLexer);
  lexer.feed('let a = "');
  expect(getTokenTypes(lexer)).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR']);
  lexer.feed('b";');
  expect(getTokenTypes(lexer)).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'STRING', 'PUNCTUATION']);
});

test('buffers incomplete multi-line comment across feeds', () => {
  const { lexer, types } = createLexerCollector(BufferedIncrementalLexer);
  lexer.feed('/* hello');
  expect(types).toEqual([]);
  lexer.feed(' world */ let x = 1;');
  expect(types).toEqual(['COMMENT', 'KEYWORD', 'IDENTIFIER', 'OPERATOR', 'NUMBER', 'PUNCTUATION']);
});


test('buffers incomplete regex across feeds', () => {
  const { lexer, types } = createLexerCollector(BufferedIncrementalLexer);
  lexer.feed('const r = /ab');
  expect(types).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'INVALID_REGEX']);
  lexer.feed('c/;');
  expect(types).toEqual([
    'KEYWORD',
    'IDENTIFIER',
    'OPERATOR',
    'INVALID_REGEX',
    'IDENTIFIER',
    'OPERATOR',
    'PUNCTUATION'
  ]);
});

test('buffers incomplete template string with expression across feeds', () => {
  const { lexer, types } = createLexerCollector(BufferedIncrementalLexer);
  lexer.feed('const t = `a ${1');
  expect(types).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR']);
  lexer.feed('+2}`;');
  expect(types).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'TEMPLATE_STRING', 'PUNCTUATION']);
});

test('saveState/restoreState resumes buffered lexing', () => {
  const { lexer } = createLexerCollector(BufferedIncrementalLexer);
  lexer.feed('const s = "hel');
  const state = lexer.saveState();

  const { lexer: resumed } = createLexerCollector(BufferedIncrementalLexer);
  resumed.restoreState(state);
  resumed.feed('lo";');

  const types = getTokenTypes(resumed);
  expect(types).toEqual([
    'KEYWORD',
    'IDENTIFIER',
    'OPERATOR',
    'STRING',
    'PUNCTUATION'
  ]);
});
