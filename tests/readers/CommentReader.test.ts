// @ts-nocheck
import { CommentReader } from "../../src/lexer/CommentReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("CommentReader reads // line comment", () => {
  const src = "//hello\n";
  const { token, stream } = runReader(CommentReader, src);
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("//hello");
  expect(stream.getPosition().index).toBe(7); // position before newline
});

test("CommentReader reads /* block comment */", () => {
  const src = "/* block */ rest";
  const { token, stream } = runReader(CommentReader, src);
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("/* block */");
  expect(stream.getPosition().index).toBe(11);
});

test("CommentReader handles unterminated block comment at EOF", () => {
  const src = "/* unterminated";
  const { token, stream } = runReader(CommentReader, src);
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe(src);
  expect(stream.eof()).toBe(true);
});

test("CommentReader handles line comment at EOF", () => {
  const src = "// end";
  const { token, stream } = runReader(CommentReader, src);
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("// end");
  expect(stream.eof()).toBe(true);
});
