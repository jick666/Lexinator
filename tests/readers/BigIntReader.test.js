import { CharStream } from "../../src/lexer/CharStream.js";
import { BigIntReader } from "../../src/lexer/BigIntReader.js";
import { runReader } from "../utils/readerTestUtils.js";

 test("BigIntReader reads bigint literal", () => {
   const stream = new CharStream("123n");
   const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
   expect(tok.type).toBe("BIGINT");
   expect(tok.value).toBe("123n");
   expect(stream.getPosition().index).toBe(4);
 });

 test("BigIntReader returns null without trailing n", () => {
   const stream = new CharStream("123");
   const pos = stream.getPosition();
   const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
   expect(tok).toBeNull();
   expect(stream.getPosition()).toEqual(pos);
 });

test("BigIntReader rejects decimal values", () => {
  const stream = new CharStream("1.0n");
  const pos = stream.getPosition();
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader rejects prefixed binary bigints", () => {
  const stream = new CharStream("0b101n");
  const pos = stream.getPosition();
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader rejects hex bigints", () => {
  const stream = new CharStream("0x1Fn");
  const pos = stream.getPosition();
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader stops before trailing digits", () => {
  const stream = new CharStream("1n2");
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok.type).toBe("BIGINT");
  expect(tok.value).toBe("1n");
  expect(stream.current()).toBe("2");
});

test("BigIntReader reads bigint with numeric separators", () => {
  const stream = new CharStream("1_000n");
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok.type).toBe("BIGINT");
  expect(tok.value).toBe("1_000n");
  expect(stream.getPosition().index).toBe(6);
});

test("BigIntReader rejects leading underscore", () => {
  const stream = new CharStream("_1n");
  const pos = stream.getPosition();
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader rejects trailing underscore", () => {
  const stream = new CharStream("1_n");
  const pos = stream.getPosition();
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader handles zero bigint", () => {
  const stream = new CharStream("0n");
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok.type).toBe("BIGINT");
  expect(tok.value).toBe("0n");
  expect(stream.getPosition().index).toBe(2);
});

test("BigIntReader reads bigint with internal separators", () => {
  const stream = new CharStream("1_2_3n");
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok.type).toBe("BIGINT");
  expect(tok.value).toBe("1_2_3n");
  expect(stream.getPosition().index).toBe(6);
});

test("BigIntReader rejects consecutive separators", () => {
  const stream = new CharStream("1__2n");
  const pos = stream.getPosition();
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader reads bigint with leading zeros", () => {
  const stream = new CharStream("00n");
  const { token: tok } = runReader(BigIntReader, undefined, undefined, stream);
  expect(tok.type).toBe("BIGINT");
  expect(tok.value).toBe("00n");
  expect(stream.getPosition().index).toBe(3);
});
