// @ts-nocheck
import { test, expect } from '@jest/globals';
import { IncrementalLexer } from '../src/integration/IncrementalLexer.js';
import { ASSIGNMENT_TYPES, getTypes } from './utils/tokenTypeUtils.js';

test('incremental lexer emits tokens as chunks are fed', () => {
  const types = [];
  const lexer = new IncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('let x');
  lexer.feed(' = 1;');
  expect(types).toEqual(ASSIGNMENT_TYPES);
});

test('getTokens returns accumulated tokens', () => {
  const lexer = new IncrementalLexer();
  lexer.feed('let a');
  lexer.feed(' = 2;');
  const types = getTypes(lexer.getTokens());
  expect(types).toEqual(ASSIGNMENT_TYPES);
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

  const types = getTypes(resumed.getTokens());
  expect(types).toEqual(ASSIGNMENT_TYPES);
});
