import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { BinaryReader } from "../../src/lexer/BinaryReader.js";

test("BinaryReader reads lowercase prefix", () => {
  const stream = new CharStream("0b1010");
  const tok = BinaryReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0b1010");
  expect(stream.getPosition().index).toBe(6);
});

test("BinaryReader reads uppercase prefix", () => {
  const stream = new CharStream("0B11");
  const tok = BinaryReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0B11");
  expect(stream.getPosition().index).toBe(4);
});

test("BinaryReader returns null when not binary", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const tok = BinaryReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BinaryReader returns null without digits", () => {
  const stream = new CharStream("0b");
  const pos = stream.getPosition();
  const tok = BinaryReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BinaryReader stops before invalid digit", () => {
  const stream = new CharStream("0b1012");
  const tok = BinaryReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.value).toBe("0b101");
  expect(stream.current()).toBe("2");
});
