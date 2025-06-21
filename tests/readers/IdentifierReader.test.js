import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { IdentifierReader } from "../../src/lexer/IdentifierReader.js";

test("§4.1 IdentifierReader: reads simple identifier", () => {
  const stream = new CharStream("abc def");
  const token = IdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("IDENTIFIER");
  expect(token.value).toBe("abc");
  expect(stream.getPosition().index).toBe(3);
});

test("§4.1 IdentifierReader: returns null for non-letter start", () => {
  const stream = new CharStream("123");
  expect(IdentifierReader(stream, ()=>{})).toBeNull();
});
