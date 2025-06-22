import { CharStream } from "../../src/lexer/CharStream.js";
import { BinaryReader } from "../../src/lexer/BinaryReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("BinaryReader reads lowercase prefix", () => {
  const { token, stream } = runReader(BinaryReader, "0b1010");
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("0b1010");
  expect(stream.getPosition().index).toBe(6);
});

test("BinaryReader reads uppercase prefix", () => {
  const { token, stream } = runReader(BinaryReader, "0B11");
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("0B11");
  expect(stream.getPosition().index).toBe(4);
});

test("BinaryReader returns null when not binary", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const { token } = runReader(BinaryReader, "123", undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BinaryReader returns null without digits", () => {
  const stream = new CharStream("0b");
  const pos = stream.getPosition();
  const { token } = runReader(BinaryReader, "0b", undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BinaryReader stops before invalid digit", () => {
  const stream = new CharStream("0b1012");
  const { token } = runReader(BinaryReader, "0b1012", undefined, stream);
  expect(token.value).toBe("0b101");
  expect(stream.current()).toBe("2");
});
