import { CharStream } from "../../src/lexer/CharStream.js";
import { OctalReader } from "../../src/lexer/OctalReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("OctalReader reads lowercase prefix", () => {
  const { token, stream } = runReader(OctalReader, "0o755");
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("0o755");
  expect(stream.getPosition().index).toBe(5);
});

test("OctalReader reads uppercase prefix", () => {
  const { token, stream } = runReader(OctalReader, "0O123");
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("0O123");
  expect(stream.getPosition().index).toBe(5);
});

test("OctalReader returns null when not octal", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const { token } = runReader(OctalReader, "123", undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("OctalReader returns null without digits", () => {
  const stream = new CharStream("0o");
  const pos = stream.getPosition();
  const { token } = runReader(OctalReader, "0o", undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("OctalReader stops before non-octal digit", () => {
  const stream = new CharStream("0o7559");
  const { token } = runReader(OctalReader, "0o7559", undefined, stream);
  expect(token.value).toBe("0o755");
  expect(stream.current()).toBe("9");
});
