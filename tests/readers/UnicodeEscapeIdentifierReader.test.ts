import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { UnicodeEscapeIdentifierReader } from "../../src/lexer/UnicodeEscapeIdentifierReader.js";

test("UnicodeEscapeIdentifierReader reads escape identifier", () => {
  const stream = new CharStream("\\u0061bc");
  const tok = UnicodeEscapeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("IDENTIFIER");
  expect(tok.value).toBe("abc");
  expect(stream.getPosition().index).toBe(8);
});

test("UnicodeEscapeIdentifierReader handles codepoint escape", () => {
  const stream = new CharStream("\\u{1F600}_end");
  const tok = UnicodeEscapeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.value).toBe("😀_end");
  expect(stream.getPosition().index).toBe(13);
});

test("UnicodeEscapeIdentifierReader returns null for bad escape", () => {
  const stream = new CharStream("\\uXYZ");
  const pos = stream.getPosition();
  const tok = UnicodeEscapeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
