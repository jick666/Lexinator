import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { UnicodeWhitespaceReader } from "../../src/lexer/UnicodeWhitespaceReader.js";

test("UnicodeWhitespaceReader reads non-ASCII whitespace", () => {
  const stream = new CharStream("\u00A0\u2003\u205Fabc");
  const tok = UnicodeWhitespaceReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("WHITESPACE");
  expect(tok.value).toBe("\u00A0\u2003\u205F");
  expect(stream.current()).toBe("a");
});

test("UnicodeWhitespaceReader handles mixed whitespace", () => {
  const stream = new CharStream(" \u2003\txyz");
  const tok = UnicodeWhitespaceReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("WHITESPACE");
  expect(tok.value).toBe(" \u2003\t");
  expect(stream.current()).toBe("x");
});
