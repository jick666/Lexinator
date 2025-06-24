import { NumberReader } from "../../src/lexer/number/NumberReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("NumberReader reads integer and decimal", () => {
  let { stream } = expectToken(NumberReader, "123 456.78", "NUMBER", "123", 3);
  stream.advance(); // skip space
  expectToken(NumberReader, undefined, "NUMBER", "456.78", 10, stream);
});

test("NumberReader handles trailing decimal point", () => {
  expectToken(NumberReader, "123.", "NUMBER", "123.", 4);
});

test("NumberReader returns null when not starting with digit", () => {
  expectNull(NumberReader, ".5");
});
