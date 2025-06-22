import { StringReader } from "../../src/lexer/StringReader.js";
import { runReader } from "../utils/readerTestUtils.js";
import { LexerError } from "../../src/lexer/LexerError.js";

test("StringReader reads double quoted string", () => {
  const src = '"abc"';
  const { token, stream } = runReader(StringReader, src);
  expect(token.type).toBe('STRING');
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("StringReader reads single quoted string", () => {
  const src = "'abc'";
  const { token, stream } = runReader(StringReader, src);
  expect(token.type).toBe('STRING');
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("StringReader returns LexerError on unterminated", () => {
  const src = '"abc';
  const { token: result } = runReader(StringReader, src);
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedString');
});

test("StringReader handles escapes", () => {
  const src = '"a\\nb"';
  const { token, stream } = runReader(StringReader, src);
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("StringReader errors on newline in string", () => {
  const src = '"a\nb"';
  const { token: result } = runReader(StringReader, src);
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedString');
});
