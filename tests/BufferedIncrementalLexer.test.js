import { BufferedIncrementalLexer } from '../src/integration/BufferedIncrementalLexer.js';
import { SIMPLE_DECL } from './utils/tokenTestUtils.js';

test('buffers incomplete string across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('const s = "hel');
  expect(types).toEqual(SIMPLE_DECL.slice(0,3));
  lexer.feed('lo";');
  expect(types).toEqual([
    SIMPLE_DECL[0],
    SIMPLE_DECL[1],
    SIMPLE_DECL[2],
    'STRING',
    SIMPLE_DECL[4]
  ]);
});

test('getTokens includes buffered results only when complete', () => {
  const lexer = new BufferedIncrementalLexer();
  lexer.feed('let a = "');
  expect(lexer.getTokens().map(t => t.type)).toEqual(SIMPLE_DECL.slice(0,3));
  lexer.feed('b";');
  expect(lexer.getTokens().map(t => t.type)).toEqual([
    SIMPLE_DECL[0],
    SIMPLE_DECL[1],
    SIMPLE_DECL[2],
    'STRING',
    SIMPLE_DECL[4]
  ]);
});

test('buffers incomplete multi-line comment across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('/* hello');
  expect(types).toEqual([]);
  lexer.feed(' world */ let x = 1;');
  expect(types).toEqual(['COMMENT', ...SIMPLE_DECL]);
});


test('buffers incomplete regex across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('const r = /ab');
  expect(types).toEqual([SIMPLE_DECL[0], SIMPLE_DECL[1], SIMPLE_DECL[2], 'INVALID_REGEX']);
  lexer.feed('c/;');
  expect(types).toEqual([
    SIMPLE_DECL[0],
    SIMPLE_DECL[1],
    SIMPLE_DECL[2],
    'INVALID_REGEX',
    SIMPLE_DECL[1],
    SIMPLE_DECL[2],
    SIMPLE_DECL[4]
  ]);
});

test('buffers incomplete template string with expression across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('const t = `a ${1');
  expect(types).toEqual(SIMPLE_DECL.slice(0,3));
  lexer.feed('+2}`;');
  expect(types).toEqual([
    SIMPLE_DECL[0],
    SIMPLE_DECL[1],
    SIMPLE_DECL[2],
    'TEMPLATE_STRING',
    SIMPLE_DECL[4]
  ]);
});

test('saveState/restoreState resumes buffered lexing', () => {
  const lexer = new BufferedIncrementalLexer();
  lexer.feed('const s = "hel');
  const state = lexer.saveState();

  const resumed = new BufferedIncrementalLexer();
  resumed.restoreState(state);
  resumed.feed('lo";');

  const types = resumed.getTokens().map(t => t.type);
  expect(types).toEqual([
    SIMPLE_DECL[0],
    SIMPLE_DECL[1],
    SIMPLE_DECL[2],
    'STRING',
    SIMPLE_DECL[4]
  ]);
});
