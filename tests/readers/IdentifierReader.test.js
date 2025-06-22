import { CharStream } from "../../src/lexer/CharStream.js";
import { IdentifierReader } from "../../src/lexer/IdentifierReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("§4.1 IdentifierReader: reads simple identifier", () => {
  const { token, stream } = runReader(IdentifierReader, "abc def");
  expect(token.type).toBe("IDENTIFIER");
  expect(token.value).toBe("abc");
  expect(stream.getPosition().index).toBe(3);
});

test("§4.1 IdentifierReader: returns null for non-letter start", () => {
  const stream = new CharStream("123");
  expect(runReader(IdentifierReader, undefined, undefined, stream).token).toBeNull();
});
