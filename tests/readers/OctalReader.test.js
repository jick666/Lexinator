import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { OctalReader } from "../../src/lexer/OctalReader.js";

test("OctalReader reads lowercase prefix", () => {
  const stream = new CharStream("0o755");
  const tok = OctalReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0o755");
  expect(stream.getPosition().index).toBe(5);
});

test("OctalReader reads uppercase prefix", () => {
  const stream = new CharStream("0O123");
  const tok = OctalReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0O123");
  expect(stream.getPosition().index).toBe(5);
});

test("OctalReader returns null when not octal", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const tok = OctalReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("OctalReader returns null without digits", () => {
  const stream = new CharStream("0o");
  const pos = stream.getPosition();
  const tok = OctalReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("OctalReader stops before non-octal digit", () => {
  const stream = new CharStream("0o7559");
  const tok = OctalReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.value).toBe("0o755");
  expect(stream.current()).toBe("9");
});
