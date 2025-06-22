import { CharStream } from "../../src/lexer/CharStream.js";
import { UnicodeIdentifierReader } from "../../src/lexer/UnicodeIdentifierReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test.each([
  ["πδ", 2],
  ["π1_2", 4],
  ["न\u200Cम", 3],
  ["न\u200Dम", 3]
])("UnicodeIdentifierReader reads %s", (src, index) => {
  expectToken(UnicodeIdentifierReader, src, "IDENTIFIER", src, index);
});

test("UnicodeIdentifierReader rejects starting digit", () => {
  const stream = new CharStream("1π");
  const start = stream.getPosition().index;
  const { token } = expectNull(UnicodeIdentifierReader, stream);
  expect(token).toBeNull();
  expect(stream.getPosition().index).toBe(start);
});

test("UnicodeIdentifierReader returns null for ASCII start", () => {
  const stream = new CharStream("aπ");
  expectNull(UnicodeIdentifierReader, stream);
});
