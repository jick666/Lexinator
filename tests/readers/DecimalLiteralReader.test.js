import { CharStream } from "../../src/lexer/CharStream.js";
import { DecimalLiteralReader } from "../../src/lexer/DecimalLiteralReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("DecimalLiteralReader reads suffix form", () => {
  const stream = new CharStream("123.45m");
  const { token: tok } = runReader(DecimalLiteralReader, undefined, undefined, stream);
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("123.45m");
  expect(stream.getPosition().index).toBe(7);
});

test("DecimalLiteralReader reads prefix form", () => {
  const stream = new CharStream("0d123.45");
  const { token: tok } = runReader(DecimalLiteralReader, undefined, undefined, stream);
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("0d123.45");
  expect(stream.getPosition().index).toBe(8);
});

test("DecimalLiteralReader reads integer suffix", () => {
  const stream = new CharStream("42m");
  const { token: tok } = runReader(DecimalLiteralReader, undefined, undefined, stream);
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("42m");
  expect(stream.getPosition().index).toBe(3);
});

test("DecimalLiteralReader reads integer prefix", () => {
  const stream = new CharStream("0d123");
  const { token: tok } = runReader(DecimalLiteralReader, undefined, undefined, stream);
  expect(tok.type).toBe("DECIMAL");
  expect(tok.value).toBe("0d123");
  expect(stream.getPosition().index).toBe(5);
});

test("DecimalLiteralReader returns null when invalid", () => {
  const stream = new CharStream("0d");
  const pos = stream.getPosition();
  const { token: tok } = runReader(DecimalLiteralReader, undefined, undefined, stream);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
