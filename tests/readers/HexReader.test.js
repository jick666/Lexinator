import { CharStream } from "../../src/lexer/CharStream.js";
import { HexReader } from "../../src/lexer/HexReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("HexReader reads lowercase prefix", () => {
  const { token, stream } = runReader(HexReader, "0x1f");
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("0x1f");
  expect(stream.getPosition().index).toBe(4);
});

test("HexReader reads uppercase prefix", () => {
  const { token, stream } = runReader(HexReader, "0XAF");
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("0XAF");
  expect(stream.getPosition().index).toBe(4);
});

test("HexReader returns null when not a hex literal", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const { token } = runReader(HexReader, "123", undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("HexReader returns null without digits", () => {
  const stream = new CharStream("0x");
  const pos = stream.getPosition();
  const { token } = runReader(HexReader, "0x", undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("HexReader stops before invalid digit", () => {
  const stream = new CharStream("0x1fg");
  const { token } = runReader(HexReader, "0x1fg", undefined, stream);
  expect(token.value).toBe("0x1f");
  expect(stream.current()).toBe("g");
});
