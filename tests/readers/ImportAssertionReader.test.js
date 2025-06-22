import { ImportAssertionReader } from "../../src/lexer/ImportAssertionReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("ImportAssertionReader reads assert clause", () => {
  expectToken(
    ImportAssertionReader,
    "assert { type: 'json' }",
    "IMPORT_ASSERTION",
    "assert { type: 'json' }"
  );
});

test("ImportAssertionReader reads with colon syntax", () => {
  expectToken(
    ImportAssertionReader,
    "assert: { type: 'json' }",
    "IMPORT_ASSERTION",
    "assert: { type: 'json' }"
  );
});

test("ImportAssertionReader returns null for non-matching text", () => {
  expectNull(ImportAssertionReader, "assert true");
});
