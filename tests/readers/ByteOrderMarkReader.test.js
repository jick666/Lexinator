import { CharStream } from "../../src/lexer/CharStream.js";
import { ByteOrderMarkReader } from "../../src/lexer/ByteOrderMarkReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("ByteOrderMarkReader consumes BOM at file start", () => {
  const { token, stream } = runReader(ByteOrderMarkReader, "\uFEFFlet a = 1;");
  expect(token.type).toBe("BOM");
  expect(token.value).toBe("\uFEFF");
  expect(stream.getPosition().index).toBe(1);
});

test("ByteOrderMarkReader returns null when not at start", () => {
  const stream = new CharStream("let a = 1;\uFEFF");
  stream.advance();
  const pos = stream.getPosition();
  const { token } = runReader(ByteOrderMarkReader, undefined, undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
