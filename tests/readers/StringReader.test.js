import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { StringReader } from "../../src/lexer/StringReader.js";
import { LexerError } from "../../src/lexer/LexerError.js";

test("StringReader reads double quoted string", () => {
  const src = '"abc"';
  const stream = new CharStream(src);
  const token = StringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe('STRING');
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("StringReader reads single quoted string", () => {
  const src = "'abc'";
  const stream = new CharStream(src);
  const token = StringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe('STRING');
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("StringReader returns LexerError on unterminated", () => {
  const src = '"abc';
  const stream = new CharStream(src);
  const result = StringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedString');
});

test("StringReader handles escapes", () => {
  const src = '"a\\nb"';
  const stream = new CharStream(src);
  const token = StringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("StringReader errors on newline in string", () => {
  const src = '"a\nb"';
  const stream = new CharStream(src);
  const result = StringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedString');
});
