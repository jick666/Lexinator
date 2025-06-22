import { CharStream } from "../../src/lexer/CharStream.js";
import { BinaryReader } from "../../src/lexer/BinaryReader.js";
import { OctalReader } from "../../src/lexer/OctalReader.js";
import { HexReader } from "../../src/lexer/HexReader.js";
import { runReader } from "../utils/readerTestUtils.js";

const cases = [
  {
    name: 'BinaryReader',
    reader: BinaryReader,
    lower: '0b1010',
    upper: '0B11',
    invalid: { src: '0b1012', expected: '0b101', invalidChar: '2' },
    not: '123'
  },
  {
    name: 'OctalReader',
    reader: OctalReader,
    lower: '0o755',
    upper: '0O123',
    invalid: { src: '0o7559', expected: '0o755', invalidChar: '9' },
    not: '123'
  },
  {
    name: 'HexReader',
    reader: HexReader,
    lower: '0x1f',
    upper: '0XAF',
    invalid: { src: '0x1fg', expected: '0x1f', invalidChar: 'g' },
    not: '123'
  }
];

describe.each(cases)('$name', ({ reader, lower, upper, invalid, not }) => {
  test('reads lowercase prefix', () => {
    const { token, stream } = runReader(reader, lower);
    expect(token.type).toBe('NUMBER');
    expect(token.value).toBe(lower);
    expect(stream.getPosition().index).toBe(lower.length);
  });

  test('reads uppercase prefix', () => {
    const { token, stream } = runReader(reader, upper);
    expect(token.type).toBe('NUMBER');
    expect(token.value).toBe(upper);
    expect(stream.getPosition().index).toBe(upper.length);
  });

  test('returns null when not matching', () => {
    const stream = new CharStream(not);
    const pos = stream.getPosition();
    const { token } = runReader(reader, not, undefined, stream);
    expect(token).toBeNull();
    expect(stream.getPosition()).toEqual(pos);
  });

  test('returns null without digits', () => {
    const prefix = lower.slice(0, 2);
    const stream = new CharStream(prefix);
    const pos = stream.getPosition();
    const { token } = runReader(reader, prefix, undefined, stream);
    expect(token).toBeNull();
    expect(stream.getPosition()).toEqual(pos);
  });

  test('stops before invalid digit', () => {
    const stream = new CharStream(invalid.src);
    const { token } = runReader(reader, invalid.src, undefined, stream);
    expect(token.value).toBe(invalid.expected);
    expect(stream.current()).toBe(invalid.invalidChar);
  });
});
