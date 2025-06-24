import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";
import { LexerError } from "../../src/lexer/LexerError.js";
import { runReader } from "../utils/readerTestUtils.js";

test("TemplateStringReader reads template with interpolation", () => {
  const src = "`template ${expr}`";
  const { token, stream } = runReader(TemplateStringReader, src);

  expect(token.type).toBe("TEMPLATE_STRING");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader produces HTML_TEMPLATE_STRING when tagged", () => {
  const src = "`<div>${x}</div>`";
  const engine = { lastToken: new Token("IDENTIFIER", "html", { index: 0 }, { index: 4 }) };
  const { token: tok } = runReader(TemplateStringReader, src, engine);
  expect(tok.type).toBe("HTML_TEMPLATE_STRING");
  expect(tok.value).toBe(src);
});

test("TemplateStringReader returns null for non-backtick start", () => {
  const stream = new CharStream("'not template'");
  const { token: result } = runReader(TemplateStringReader, undefined, undefined, stream);

  expect(result).toBeNull();
});

test("TemplateStringReader returns LexerError on unterminated template", () => {
  const stream = new CharStream('`unterminated');
  const { token: result } = runReader(TemplateStringReader, undefined, undefined, stream);
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedTemplate');
  expect(result.toString()).toContain('line 1, column 0');
});

test("TemplateStringReader returns INVALID_TEMPLATE_STRING on bad escape", () => {
  const stream = new CharStream('`bad \\');
  const { token: result } = runReader(TemplateStringReader, undefined, undefined, stream);
  expect(result.type).toBe('INVALID_TEMPLATE_STRING');
});

test("TemplateStringReader handles escapes and nested braces", () => {
  const src = "`a ${b\\} c}`";
  const { token, stream } = runReader(TemplateStringReader, src);
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader tracks nested braces", () => {
  const src = "`t ${ {a:{b}} } end`";
  const { token, stream } = runReader(TemplateStringReader, src);
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader handles multi-line content", () => {
  const src = "`line1\nline2`";
  const { token, stream } = runReader(TemplateStringReader, src);
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader errors on unterminated expression", () => {
  const src = "`a ${b"; // missing closing brace and backtick
  const { token: result } = runReader(TemplateStringReader, src);
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe("UnterminatedTemplate");
});

test("TemplateStringReader handles nested template expressions", () => {
  const src = "`a ${`inner ${1}`}`";
  const { token: tok, stream } = runReader(TemplateStringReader, src);
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader handles CRLF line endings", () => {
  const src = "`line1\r\nline2`";
  const { token: tok, stream } = runReader(TemplateStringReader, src);
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader returns INVALID_TEMPLATE_STRING on escape at EOF", () => {
  const src = "`abc\\"; // backslash at end
  const { token: result } = runReader(TemplateStringReader, src);
  expect(result.type).toBe("INVALID_TEMPLATE_STRING");
});

test("TemplateStringReader handles empty template", () => {
  const src = "``";
  const { token: tok, stream } = runReader(TemplateStringReader, src);
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(2);
});

test("TemplateStringReader handles braces inside strings", () => {
  const src = "`a ${ '{' }`";
  const { token: tok, stream } = runReader(TemplateStringReader, src);
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});


test("TemplateStringReader handles escaped backtick in expression", () => {
  const src = "`a ${`inner \\` backtick`}`";
  const { token: tok } = runReader(TemplateStringReader, src);
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
});

test("TemplateStringReader allows extra closing brace", () => {
  const src = "`a ${1}} b`";
  const { token: tok, stream } = runReader(TemplateStringReader, src);
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader handles deeply nested templates", () => {
  const src = "`start ${`level1 ${`level2 ${3}`}`}`";
  const { token: tok, stream } = runReader(TemplateStringReader, src);
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});
