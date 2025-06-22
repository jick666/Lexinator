import { BufferedIncrementalLexer } from '../src/integration/BufferedIncrementalLexer.js';
import { PREFIX_TYPES, STRING_ASSIGN_TYPES, COMMENT_ASSIGN_TYPES, getTypes } from './utils/tokenTypeUtils.js';

test('buffers incomplete string across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('const s = "hel');
  expect(types).toEqual(PREFIX_TYPES);
  lexer.feed('lo";');
  expect(types).toEqual(STRING_ASSIGN_TYPES);
});

test('getTokens includes buffered results only when complete', () => {
  const lexer = new BufferedIncrementalLexer();
  lexer.feed('let a = "');
  expect(getTypes(lexer.getTokens())).toEqual(PREFIX_TYPES);
  lexer.feed('b";');
  expect(getTypes(lexer.getTokens())).toEqual(STRING_ASSIGN_TYPES);
});

test('buffers incomplete multi-line comment across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('/* hello');
  expect(types).toEqual([]);
  lexer.feed(' world */ let x = 1;');
  expect(types).toEqual(COMMENT_ASSIGN_TYPES);
});


test('buffers incomplete regex across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('const r = /ab');
  expect(types).toEqual([...PREFIX_TYPES, 'INVALID_REGEX']);
  lexer.feed('c/;');
  expect(types).toEqual([
    ...PREFIX_TYPES,
    'INVALID_REGEX',
    'IDENTIFIER',
    'OPERATOR',
    'PUNCTUATION'
  ]);
});

test('buffers incomplete template string with expression across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('const t = `a ${1');
  expect(types).toEqual(PREFIX_TYPES);
  lexer.feed('+2}`;');
  expect(types).toEqual([...PREFIX_TYPES, 'TEMPLATE_STRING', 'PUNCTUATION']);
});

test('saveState/restoreState resumes buffered lexing', () => {
  const lexer = new BufferedIncrementalLexer();
  lexer.feed('const s = "hel');
  const state = lexer.saveState();

  const resumed = new BufferedIncrementalLexer();
  resumed.restoreState(state);
  resumed.feed('lo";');

  const types = getTypes(resumed.getTokens());
  expect(types).toEqual(STRING_ASSIGN_TYPES);
});
