import { jest } from "@jest/globals";
import { JSXReader } from "../../src/lexer/JSXReader.js";
import { LexerError } from "../../src/lexer/LexerError.js";
import { runReader } from "../utils/readerTestUtils.js";

const dummyEngine = { popMode() {} };

test("JSXReader reads simple element", () => {
  const { token, stream } = runReader(JSXReader, '<div>', dummyEngine);
  expect(token.type).toBe('JSX_TEXT');
  expect(token.value).toBe('<div>');
  expect(stream.getPosition().index).toBe(5);
});

test("JSXReader handles quoted attributes", () => {
  const src = '<div class="a">';
  const { token, stream } = runReader(JSXReader, src, dummyEngine);
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("JSXReader tracks nested elements", () => {
  const { token, stream } = runReader(JSXReader, '<div><span>', dummyEngine);
  expect(token.value).toBe('<div>');
  expect(stream.getPosition().index).toBe(5);
});

test("JSXReader returns LexerError on unterminated", () => {
  const { token } = runReader(JSXReader, '<div', dummyEngine);
  expect(token).toBeInstanceOf(LexerError);
  expect(token.type).toBe('UnterminatedJSX');
});

test("JSXReader handles escaped quotes and calls popMode", () => {
  const src = '<div class="a\\"b">';
  const engine = { popMode: jest.fn() };
  const { token, stream } = runReader(JSXReader, src, engine);
  expect(token.value).toBe(src);
  expect(engine.popMode).toHaveBeenCalled();
  expect(stream.getPosition().index).toBe(src.length);
});
