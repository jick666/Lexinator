// @ts-nocheck
import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";

export function runReader(reader, src, engine, stream) {
  const str = stream || new CharStream(src);
  const token = reader(str, (t, v, s, e) => new Token(t, v, s, e), engine);
  return { token, stream: str };
}

export function expectToken(reader, src, type, value, index = value.length, stream) {
  const { token, stream: str } = runReader(reader, src, undefined, stream);
  expect(token.type).toBe(type);
  expect(token.value).toBe(value);
  expect(str.getPosition().index).toBe(index);
  return { token, stream: str };
}

export function expectNull(reader, srcOrStream) {
  const stream = srcOrStream instanceof CharStream
    ? srcOrStream
    : new CharStream(srcOrStream);
  const pos = stream.getPosition();
  const { token } = runReader(reader, undefined, undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
  return { token, stream };
}

