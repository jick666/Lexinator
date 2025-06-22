import { BigIntReader } from "../../src/lexer/BigIntReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("BigIntReader reads bigint literal", () => {
  expectToken(BigIntReader, "123n", "BIGINT", "123n", 4);
});

test("BigIntReader returns null without trailing n", () => {
  expectNull(BigIntReader, "123");
});

test("BigIntReader rejects decimal values", () => {
  expectNull(BigIntReader, "1.0n");
});

test("BigIntReader rejects prefixed binary bigints", () => {
  expectNull(BigIntReader, "0b101n");
});

test("BigIntReader rejects hex bigints", () => {
  expectNull(BigIntReader, "0x1Fn");
});

test("BigIntReader stops before trailing digits", () => {
  const { stream } = expectToken(BigIntReader, "1n2", "BIGINT", "1n", 2);
  expect(stream.current()).toBe("2");
});

test("BigIntReader reads bigint with numeric separators", () => {
  expectToken(BigIntReader, "1_000n", "BIGINT", "1_000n", 6);
});

test("BigIntReader rejects leading underscore", () => {
  expectNull(BigIntReader, "_1n");
});

test("BigIntReader rejects trailing underscore", () => {
  expectNull(BigIntReader, "1_n");
});

test("BigIntReader handles zero bigint", () => {
  expectToken(BigIntReader, "0n", "BIGINT", "0n", 2);
});

test("BigIntReader reads bigint with internal separators", () => {
  expectToken(BigIntReader, "1_2_3n", "BIGINT", "1_2_3n", 6);
});

test("BigIntReader rejects consecutive separators", () => {
  expectNull(BigIntReader, "1__2n");
});

test("BigIntReader reads bigint with leading zeros", () => {
  expectToken(BigIntReader, "00n", "BIGINT", "00n", 3);
});
