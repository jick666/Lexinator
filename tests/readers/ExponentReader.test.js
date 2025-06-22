import { ExponentReader } from "../../src/lexer/ExponentReader.js";
import { expectToken, expectNull, runReader } from "../utils/readerTestUtils.js";

test.each([
  ["1e3", 3],
  ["3.5E+2", 6],
  ["2e-3", 4],
  ["1.e2", 4]
])("ExponentReader reads %s", (src, index) => {
  expectToken(ExponentReader, src, "NUMBER", src, index);
});

test.each(["2e+", "123", "1e+"])('ExponentReader returns null for %s', (src) => {
  expectNull(ExponentReader, src);
});



test("ExponentReader stops before second exponent", () => {
  const { token, stream } = runReader(ExponentReader, "1e10e2");
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("1e10");
  expect(stream.current()).toBe("e");
});
