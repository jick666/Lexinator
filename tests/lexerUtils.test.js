import { CharStream } from '../src/lexer/CharStream.js';
import { readUnicodeEscape, consumeIdentifierLike, readDigitsWithUnderscores, readNumberLiteral, consumeKeyword } from '../src/lexer/utils.js';

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
  test('readUnicodeEscape rejects too many hex digits', () => {
    const stream = new CharStream('\\u{1234567}');
    expect(readUnicodeEscape(stream)).toBeNull();
  });

  test('readUnicodeEscape rejects missing closing brace', () => {
    const stream = new CharStream('\\u{41');
    expect(readUnicodeEscape(stream)).toBeNull();
  });

  test('readDigitsWithUnderscores tracks ending underscore', () => {
    const stream = new CharStream('1_');
    const res = readDigitsWithUnderscores(stream, 0);
    expect(res).toEqual({ value: '1_', underscoreSeen: true, lastUnderscore: true });
  });

  test('readDigitsWithUnderscores accepts leading underscore', () => {
    const stream = new CharStream('_1');
    const res = readDigitsWithUnderscores(stream, 0);
    expect(res).toEqual({ value: '_1', underscoreSeen: true, lastUnderscore: false });
  });

  test('readNumberLiteral handles trailing dot without fraction', () => {
    const stream = new CharStream('1.');
    const res = readNumberLiteral(stream, 0);
    expect(res.value).toBe('1.');
    expect(res.ch).toBeNull();
  });

  test('readNumberLiteral returns next char after digits', () => {
    const stream = new CharStream('1.2a');
    const res = readNumberLiteral(stream, 0);
    expect(res.value).toBe('1.2');
    expect(res.ch).toBe('a');
  });

  test('consumeKeyword consumes keyword at start', () => {
    const stream = new CharStream('let x');
    const pos = consumeKeyword(stream, 'let');
    expect(pos.index).toBe(3);
    expect(stream.index).toBe(3);
  });

  test('consumeKeyword rejects when next char is ident', () => {
    const stream = new CharStream('letx');
    expect(consumeKeyword(stream, 'let')).toBeNull();
  });

  test('consumeKeyword respects checkPrev', () => {
    const stream = new CharStream('alet');
    stream.index = 1;
    expect(consumeKeyword(stream, 'let')).toBeNull();
    stream.index = 1;
    const pos = consumeKeyword(stream, 'let', { checkPrev: false });
    expect(pos.index).toBe(4);
  });

  test('consumeIdentifierLike rejects starting digit', () => {
    const stream = new CharStream('1abc');
    expect(consumeIdentifierLike(stream)).toBeNull();
  });

  test('consumeIdentifierLike rejects leading hash', () => {
    const stream = new CharStream('#foo');
    expect(consumeIdentifierLike(stream)).toBeNull();
  });

  test('consumeIdentifierLike stops on bad escape in middle', () => {
    const stream = new CharStream('A\\u00G0c');
    expect(consumeIdentifierLike(stream, { allowEscape: true })).toBe('A');
  });

  test('readUnicodeEscape returns null when not starting with escape', () => {
    const stream = new CharStream('abc');
    expect(readUnicodeEscape(stream)).toBeNull();
  });
});
