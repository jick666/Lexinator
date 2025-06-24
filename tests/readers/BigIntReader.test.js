import { BigIntReader } from "../../src/lexer/number/BigIntReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

const tokenCases = [
  ["reads bigint literal", "123n", "BIGINT", "123n", 4],
  ["reads bigint with numeric separators", "1_000n", "BIGINT", "1_000n", 6],
  ["handles zero bigint", "0n", "BIGINT", "0n", 2],
  ["reads bigint with internal separators", "1_2_3n", "BIGINT", "1_2_3n", 6],
  ["reads bigint with leading zeros", "00n", "BIGINT", "00n", 3],
];

test.each(tokenCases)("BigIntReader %s", (_desc, src, type, value, index) => {
  expectToken(BigIntReader, src, type, value, index);
});

const nullCases = [
  ["returns null without trailing n", "123"],
  ["rejects decimal values", "1.0n"],
  ["rejects prefixed binary bigints", "0b101n"],
  ["rejects hex bigints", "0x1Fn"],
  ["rejects leading underscore", "_1n"],
  ["rejects trailing underscore", "1_n"],
  ["rejects consecutive separators", "1__2n"],
];

test.each(nullCases)("BigIntReader %s", (_desc, src) => {
  expectNull(BigIntReader, src);
});

test("BigIntReader stops before trailing digits", () => {
  const { stream } = expectToken(BigIntReader, "1n2", "BIGINT", "1n", 2);
  expect(stream.current()).toBe("2");
});
