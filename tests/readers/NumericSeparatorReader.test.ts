import { NumericSeparatorReader } from "../../src/lexer/number/NumericSeparatorReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("NumericSeparatorReader reads underscores", () => {
  expectToken(NumericSeparatorReader, "1_000", "NUMBER", "1_000", 5);
});

test("NumericSeparatorReader returns null without underscores", () => {
  expectNull(NumericSeparatorReader, "1234");
});

test("NumericSeparatorReader rejects trailing underscore", () => {
  expectNull(NumericSeparatorReader, "1_000_");
});

test("NumericSeparatorReader rejects consecutive underscores", () => {
  expectNull(NumericSeparatorReader, "1__0");
});

test("NumericSeparatorReader stops at non-digit", () => {
  expectToken(NumericSeparatorReader, "1_2a", "NUMBER", "1_2", 3);
});

test("NumericSeparatorReader rejects leading underscore", () => {
  expectNull(NumericSeparatorReader, "_1");
});

test("NumericSeparatorReader stops before decimal point", () => {
  const { stream } = expectToken(NumericSeparatorReader, "1_000.5", "NUMBER", "1_000", 5);
  expect(stream.current()).toBe(".");
});

test("NumericSeparatorReader stops before exponent", () => {
  const { stream } = expectToken(NumericSeparatorReader, "1_0e5", "NUMBER", "1_0", 3);
  expect(stream.current()).toBe("e");
});
