import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { HexReader } from "../../src/lexer/HexReader.js";

test("HexReader reads lowercase prefix", () => {
  const stream = new CharStream("0x1f");
  const tok = HexReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0x1f");
  expect(stream.getPosition().index).toBe(4);
});

test("HexReader reads uppercase prefix", () => {
  const stream = new CharStream("0XAF");
  const tok = HexReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0XAF");
  expect(stream.getPosition().index).toBe(4);
});

test("HexReader returns null when not a hex literal", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const tok = HexReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("HexReader returns null without digits", () => {
  const stream = new CharStream("0x");
  const pos = stream.getPosition();
  const tok = HexReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("HexReader stops before invalid digit", () => {
  const stream = new CharStream("0x1fg");
  const tok = HexReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.value).toBe("0x1f");
  expect(stream.current()).toBe("g");
});
