import { CharStream } from "../../src/lexer/CharStream.js";
import { ImportCallReader } from "../../src/lexer/ImportCallReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("ImportCallReader reads import(", () => {
  const { token } = runReader(ImportCallReader, "import(");
  expect(token.type).toBe("IMPORT_CALL");
  expect(token.value).toBe("import");
});

test("ImportCallReader returns null when not followed by paren", () => {
  const stream = new CharStream("import;");
  const pos = stream.getPosition();
  const { token } = runReader(ImportCallReader, undefined, undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
