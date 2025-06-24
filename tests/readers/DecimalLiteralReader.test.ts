import { DecimalLiteralReader } from "../../src/lexer/number/DecimalLiteralReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("DecimalLiteralReader reads suffix form", () => {
  expectToken(DecimalLiteralReader, "123.45m", "DECIMAL", "123.45m", 7);
});

test("DecimalLiteralReader reads prefix form", () => {
  expectToken(DecimalLiteralReader, "0d123.45", "DECIMAL", "0d123.45", 8);
});

test("DecimalLiteralReader reads integer suffix", () => {
  expectToken(DecimalLiteralReader, "42m", "DECIMAL", "42m", 3);
});

test("DecimalLiteralReader reads integer prefix", () => {
  expectToken(DecimalLiteralReader, "0d123", "DECIMAL", "0d123", 5);
});

test("DecimalLiteralReader returns null when invalid", () => {
  expectNull(DecimalLiteralReader, "0d");
});
