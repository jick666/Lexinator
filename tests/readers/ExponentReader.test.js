import { CharStream } from "../../src/lexer/CharStream.js";
import { ExponentReader } from "../../src/lexer/ExponentReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test.each([
  ["1e3", 3],
  ["3.5E+2", 6],
  ["2e-3", 4],
  ["1.e2", 4]
])("ExponentReader reads %s", (src, index) => {
  expectToken(ExponentReader, src, "NUMBER", src, index);
});

test.each(["2e+", "123", "1e+"])("ExponentReader returns null for %s", src => {
  expectNull(ExponentReader, src);
});


test("ExponentReader stops before second exponent", () => {
  const stream = new CharStream("1e10e2");
  const { stream: s } = expectToken(ExponentReader, undefined, "NUMBER", "1e10", 4, stream);
  expect(s.current()).toBe("e");
});


