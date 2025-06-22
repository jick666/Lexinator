import { ImportMetaReader } from "../../src/lexer/ImportMetaReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("ImportMetaReader reads import.meta", () => {
  expectToken(ImportMetaReader, "import.meta", "IMPORT_META", "import.meta", 11);
});

test("ImportMetaReader returns null when sequence mismatched", () => {
  expectNull(ImportMetaReader, "import.met");
});
