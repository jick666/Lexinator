import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { PunctuationReader } from "../../src/lexer/PunctuationReader.js";

test("PunctuationReader reads punctuation", () => {
  const stream = new CharStream("; , .");
  const token = PunctuationReader(stream, (type, value, start, end) => new Token(type, value, start, end));
  expect(token.type).toBe("PUNCTUATION");
  expect(token.value).toBe(";");
});
