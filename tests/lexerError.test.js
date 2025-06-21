import { LexerError } from '../src/lexer/LexerError.js';

test('LexerError formatting helpers', () => {
  const err = new LexerError(
    'BadToken',
    'unexpected',
    { line: 1, column: 2 },
    { line: 1, column: 3 },
    'abc'
  );
  expect(err.location).toBe('line 1, column 2');
  expect(err.context).toBe('abc\n  ^');
  expect(err.toString()).toContain('LexerError[BadToken]');
  expect(err.toJSON()).toEqual({
    type: 'BadToken',
    message: 'unexpected',
    start: { line: 1, column: 2 },
    end: { line: 1, column: 3 }
  });
});

test('LexerError context handles missing input', () => {
  const err = new LexerError(
    'SomeError',
    'oops',
    { line: 2, column: 1 },
    { line: 2, column: 2 }
  );
  expect(err.context).toBe('');
  expect(err.toString()).toContain('line 2, column 1');
});

test('LexerError context uses blank line when out of range', () => {
  const err = new LexerError(
    'Other',
    'bad',
    { line: 5, column: 2 },
    { line: 5, column: 3 },
    'a\nb'
  );
  expect(err.context).toBe('\n  ^');
});

import { tokenize } from '../src/index.js';

test('tokenize includes sourceURL in tokens', () => {
  const toks = tokenize('let a = 1;', { sourceURL: 'foo.js' });
  expect(toks[0].sourceURL).toBe('foo.js');
});
