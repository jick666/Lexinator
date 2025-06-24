import { CharStream } from "../../src/lexer/CharStream.js";
import { HTMLCommentReader } from "../../src/lexer/HTMLCommentReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test.each([
  ["<!-- hello\nlet a = 1;", "<!-- hello", 10],
  ["--> end\n", "--> end", 7]
])("HTMLCommentReader reads %s", (src, value, index) => {
  const { stream } = expectToken(HTMLCommentReader, src, "COMMENT", value, index);
  expect(stream.current()).toBe("\n");
});

test("HTMLCommentReader returns null mid-line", () => {
  const src = "var a; <!-- hi";
  const stream = new CharStream(src);
  for (let i = 0; i < 7; i++) stream.advance();
  expectNull(HTMLCommentReader, stream);
});
