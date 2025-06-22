import { CharStream } from "../../src/lexer/CharStream.js";
import { ByteOrderMarkReader } from "../../src/lexer/ByteOrderMarkReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("ByteOrderMarkReader consumes BOM at file start", () => {
  const { stream } = expectToken(
    ByteOrderMarkReader,
    "\uFEFFlet a = 1;",
    "BOM",
    "\uFEFF",
    1
  );
  // ensure other chars remain unread
  expect(stream.current()).toBe("l");
});

test("ByteOrderMarkReader returns null when not at start", () => {
  const stream = new CharStream("let a = 1;\uFEFF");
  stream.advance();
  expectNull(ByteOrderMarkReader, stream);
});
