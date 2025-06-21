import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { NumberReader } from "../../src/lexer/NumberReader.js";

test("NumberReader reads integer and decimal", () => {
  let stream = new CharStream("123 456.78");
  let token = NumberReader(stream, (type, value, start, end) => new Token(type, value, start, end));
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("123");
  stream.advance(); // skip space
  token = NumberReader(stream, (type, value, start, end) => new Token(type, value, start, end));
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("456.78");
});

test("NumberReader handles trailing decimal point", () => {
  const stream = new CharStream("123.");
  const token = NumberReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("123.");
  expect(stream.getPosition().index).toBe(4);
});

test("NumberReader returns null when not starting with digit", () => {
  const stream = new CharStream(".5");
  const pos = stream.getPosition();
  const token = NumberReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
