import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { NumericSeparatorReader } from "../../src/lexer/NumericSeparatorReader.js";

test("NumericSeparatorReader reads underscores", () => {
  const stream = new CharStream("1_000");
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1_000");
  expect(stream.getPosition().index).toBe(5);
});

test("NumericSeparatorReader returns null without underscores", () => {
  const stream = new CharStream("1234");
  const index = stream.getPosition().index;
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(index);
});

test("NumericSeparatorReader rejects trailing underscore", () => {
  const stream = new CharStream("1_000_");
  const index = stream.getPosition().index;
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(index);
});

test("NumericSeparatorReader rejects consecutive underscores", () => {
  const stream = new CharStream("1__0");
  const index = stream.getPosition().index;
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(index);
});

test("NumericSeparatorReader stops at non-digit", () => {
  const stream = new CharStream("1_2a");
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1_2");
  expect(stream.getPosition().index).toBe(3);
});

test("NumericSeparatorReader rejects leading underscore", () => {
  const stream = new CharStream("_1");
  const pos = stream.getPosition();
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("NumericSeparatorReader stops before decimal point", () => {
  const stream = new CharStream("1_000.5");
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1_000");
  expect(stream.current()).toBe(".");
});

test("NumericSeparatorReader stops before exponent", () => {
  const stream = new CharStream("1_0e5");
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1_0");
  expect(stream.current()).toBe("e");
});
