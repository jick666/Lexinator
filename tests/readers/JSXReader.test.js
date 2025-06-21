import { jest } from "@jest/globals";
import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { JSXReader } from "../../src/lexer/JSXReader.js";
import { LexerError } from "../../src/lexer/LexerError.js";

const dummyEngine = { popMode() {} };

test("JSXReader reads simple element", () => {
  const src = '<div>';
  const stream = new CharStream(src);
  const token = JSXReader(stream, (t,v,s,e) => new Token(t,v,s,e), dummyEngine);
  expect(token.type).toBe('JSX_TEXT');
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("JSXReader handles quoted attributes", () => {
  const src = '<div class="a">';
  const stream = new CharStream(src);
  const token = JSXReader(stream, (t,v,s,e) => new Token(t,v,s,e), dummyEngine);
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("JSXReader tracks nested elements", () => {
  const src = '<div><span>';
  const stream = new CharStream(src);
  const token = JSXReader(stream, (t,v,s,e) => new Token(t,v,s,e), dummyEngine);
  expect(token.value).toBe('<div>');
  expect(stream.getPosition().index).toBe(5);
});

test("JSXReader returns LexerError on unterminated", () => {
  const src = '<div';
  const stream = new CharStream(src);
  const result = JSXReader(stream, (t,v,s,e) => new Token(t,v,s,e), dummyEngine);
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedJSX');
});

test("JSXReader handles escaped quotes and calls popMode", () => {
  const src = '<div class="a\\"b">';
  const stream = new CharStream(src);
  const engine = { popMode: jest.fn() };
  const token = JSXReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(token.value).toBe(src);
  expect(engine.popMode).toHaveBeenCalled();
  expect(stream.getPosition().index).toBe(src.length);
});
