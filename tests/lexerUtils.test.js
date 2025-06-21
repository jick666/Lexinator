import { CharStream } from '../src/lexer/CharStream.js';
import { readUnicodeEscape, consumeIdentifierLike, readDigitsWithUnderscores, readNumberLiteral } from '../src/lexer/utils.js';

describe('lexer utils', () => {
  test('readUnicodeEscape parses escapes', () => {
    const stream = new CharStream('\\u{41}');
    expect(readUnicodeEscape(stream)).toBe('A');
  });

  test('readUnicodeEscape returns null for invalid', () => {
    const stream = new CharStream('\\u123');
    expect(readUnicodeEscape(stream)).toBeNull();
  });

  test('consumeIdentifierLike handles escapes', () => {
    const stream = new CharStream('\\u0041bc');
    expect(consumeIdentifierLike(stream, { allowEscape: true })).toBe('Abc');
  });

  test('consumeIdentifierLike handles escapes in the middle', () => {
    const stream = new CharStream('A\\u0042c');
    expect(consumeIdentifierLike(stream, { allowEscape: true })).toBe('ABc');
  });

  test('readDigitsWithUnderscores parses underscores', () => {
    const stream = new CharStream('1_000');
    const res = readDigitsWithUnderscores(stream, 0);
    expect(res).toEqual({ value: '1_000', underscoreSeen: true, lastUnderscore: false });
  });

  test('readDigitsWithUnderscores rejects consecutive underscores', () => {
    const stream = new CharStream('1__0');
    expect(readDigitsWithUnderscores(stream, 0)).toBeNull();
  });

  test('readNumberLiteral parses decimals', () => {
    const stream = new CharStream('12.34');
    const result = readNumberLiteral(stream, 0);
    expect(result.value).toBe('12.34');
    expect(result.ch).toBeNull();
  });

  test('readNumberLiteral enforces fraction when required', () => {
    const stream = new CharStream('1.');
    expect(readNumberLiteral(stream, 0, true)).toBeNull();
  });
});
