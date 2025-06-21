import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { UnicodeIdentifierReader } from "../../src/lexer/UnicodeIdentifierReader.js";

test("UnicodeIdentifierReader reads non-ASCII identifier", () => {
  const stream = new CharStream("πδ");
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("IDENTIFIER");
  expect(tok.value).toBe("πδ");
  expect(stream.getPosition().index).toBe(2);
});

test("UnicodeIdentifierReader allows digits and underscores", () => {
  const stream = new CharStream("π1_2");
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.value).toBe("π1_2");
  expect(stream.getPosition().index).toBe(4);
});

test("UnicodeIdentifierReader rejects starting digit", () => {
  const stream = new CharStream("1π");
  const start = stream.getPosition().index;
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(start);
});

test("UnicodeIdentifierReader handles ZWNJ", () => {
  const id = "न\u200Cम";
  const stream = new CharStream(id);
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.value).toBe(id);
  expect(stream.getPosition().index).toBe(3);
});

test("UnicodeIdentifierReader handles ZWJ", () => {
  const id = "न\u200Dम";
  const stream = new CharStream(id);
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.value).toBe(id);
  expect(stream.getPosition().index).toBe(3);
});

test("UnicodeIdentifierReader returns null for ASCII start", () => {
  const stream = new CharStream("aπ");
  const pos = stream.getPosition();
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
