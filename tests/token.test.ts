// @ts-nocheck
import { expect, test } from '@jest/globals';
import { tokenize } from '../src/index.js';
import { Token } from '../src/lexer/Token.js';

test('Token.toJSON produces plain object', () => {
  const tok = new Token(
    'NUMBER',
    '1',
    { line: 1, column: 0, index: 0, sourceURL: 'test.js' },
    { line: 1, column: 1, index: 1, sourceURL: 'test.js' }
  );
  const expected = {
    type: 'NUMBER',
    value: '1',
    start: { line: 1, column: 0, index: 0, sourceURL: 'test.js' },
    end: { line: 1, column: 1, index: 1, sourceURL: 'test.js' },
    range: [0, 1],
    sourceURL: 'test.js'
  };
  expect(tok.toJSON()).toEqual(expected);
  expect(JSON.parse(JSON.stringify(tok))).toEqual(expected);
});

test('tokenize includes sourceURL in tokens', () => {
  const toks = tokenize('let a = 1;', { sourceURL: 'foo.js' });
  expect(toks[0].sourceURL).toBe('foo.js');
});
