import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { WhitespaceReader } from "../../src/lexer/WhitespaceReader.js";

test("WhitespaceReader reads consecutive spaces", () => {
  const stream = new CharStream("   abc");
  const token = WhitespaceReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("WHITESPACE");
  expect(token.value).toBe("   ");
  expect(stream.getPosition().index).toBe(3);
  expect(stream.current()).toBe("a");
});

test("WhitespaceReader handles mixed whitespace characters", () => {
  const stream = new CharStream(" \t\n\r\v\fabc");
  const token = WhitespaceReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("WHITESPACE");
  expect(token.value).toBe(" \t\n\r\v\f");
  expect(stream.getPosition().index).toBe(6);
  expect(stream.current()).toBe("a");
});
