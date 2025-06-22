import { tokenize } from '../../src/index.js';

export const SIMPLE_DECL = ['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'NUMBER', 'PUNCTUATION'];

export function getTokenTypes(src, opts) {
  return tokenize(src, opts).map(t => t.type);
}

export function expectTokenTypes(src, expected, opts) {
  expect(getTokenTypes(src, opts)).toEqual(expected);
}
