import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { DecimalLiteralReader } from "../../src/lexer/DecimalLiteralReader.js";

test("DecimalLiteralReader reads suffix form", () => {
  const stream = new CharStream("123.45m");
  const tok = DecimalLiteralReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("123.45m");
  expect(stream.getPosition().index).toBe(7);
});

test("DecimalLiteralReader reads prefix form", () => {
  const stream = new CharStream("0d123.45");
  const tok = DecimalLiteralReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("0d123.45");
  expect(stream.getPosition().index).toBe(8);
});

test("DecimalLiteralReader reads integer suffix", () => {
  const stream = new CharStream("42m");
  const tok = DecimalLiteralReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("42m");
  expect(stream.getPosition().index).toBe(3);
});

test("DecimalLiteralReader reads integer prefix", () => {
  const stream = new CharStream("0d123");
  const tok = DecimalLiteralReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("0d123");
  expect(stream.getPosition().index).toBe(5);
});

test("DecimalLiteralReader returns null when invalid", () => {
  const stream = new CharStream("0d");
  const pos = stream.getPosition();
  const tok = DecimalLiteralReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
