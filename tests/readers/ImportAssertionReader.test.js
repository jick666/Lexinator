import { CharStream } from "../../src/lexer/CharStream.js";
import { ImportAssertionReader } from "../../src/lexer/ImportAssertionReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("ImportAssertionReader reads assert clause", () => {
  const { token } = runReader(ImportAssertionReader, "assert { type: 'json' }");
  expect(token.type).toBe("IMPORT_ASSERTION");
  expect(token.value).toBe("assert { type: 'json' }");
});

test("ImportAssertionReader reads with colon syntax", () => {
  const { token } = runReader(ImportAssertionReader, "assert: { type: 'json' }");
  expect(token.type).toBe("IMPORT_ASSERTION");
  expect(token.value).toBe("assert: { type: 'json' }");
});

test("ImportAssertionReader returns null for non-matching text", () => {
  const stream = new CharStream("assert true");
  const pos = stream.getPosition();
  const { token } = runReader(ImportAssertionReader, undefined, undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
