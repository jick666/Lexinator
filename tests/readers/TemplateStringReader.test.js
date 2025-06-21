import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";
import { LexerError } from "../../src/lexer/LexerError.js";

test("TemplateStringReader reads template with interpolation", () => {
  const src = "`template ${expr}`";
  const stream = new CharStream(src);
  const token = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );

  expect(token.type).toBe("TEMPLATE_STRING");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader produces HTML_TEMPLATE_STRING when tagged", () => {
  const src = "`<div>${x}</div>`";
  const stream = new CharStream(src);
  const engine = { lastToken: new Token("IDENTIFIER", "html", { index: 0 }, { index: 4 }) };
  const tok = TemplateStringReader(stream, (t, v, s, e) => new Token(t, v, s, e), engine);
  expect(tok.type).toBe("HTML_TEMPLATE_STRING");
  expect(tok.value).toBe(src);
});

test("TemplateStringReader returns null for non-backtick start", () => {
  const stream = new CharStream("'not template'");
  const result = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );

  expect(result).toBeNull();
});

test("TemplateStringReader returns LexerError on unterminated template", () => {
  const stream = new CharStream('`unterminated');
  const result = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedTemplate');
  expect(result.toString()).toContain('line 1, column 0');
});

test("TemplateStringReader returns INVALID_TEMPLATE_STRING on bad escape", () => {
  const stream = new CharStream('`bad \\');
  const result = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );
  expect(result.type).toBe('INVALID_TEMPLATE_STRING');
});

test("TemplateStringReader handles escapes and nested braces", () => {
  const src = "`a ${b\\} c}`";
  const stream = new CharStream(src);
  const token = TemplateStringReader(
    stream,
    (t, v, s, e) => new Token(t, v, s, e)
  );
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader tracks nested braces", () => {
  const src = "`t ${ {a:{b}} } end`";
  const stream = new CharStream(src);
  const token = TemplateStringReader(
    stream,
    (t, v, s, e) => new Token(t, v, s, e)
  );
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader handles multi-line content", () => {
  const src = "`line1\nline2`";
  const stream = new CharStream(src);
  const token = TemplateStringReader(
    stream,
    (t, v, s, e) => new Token(t, v, s, e)
  );
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader errors on unterminated expression", () => {
  const src = "`a ${b"; // missing closing brace and backtick
  const stream = new CharStream(src);
  const result = TemplateStringReader(
    stream,
    (t, v, s, e) => new Token(t, v, s, e)
  );
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe("UnterminatedTemplate");
});

test("TemplateStringReader handles nested template expressions", () => {
  const src = "`a ${`inner ${1}`}`";
  const stream = new CharStream(src);
  const tok = TemplateStringReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader handles CRLF line endings", () => {
  const src = "`line1\r\nline2`";
  const stream = new CharStream(src);
  const tok = TemplateStringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader returns INVALID_TEMPLATE_STRING on escape at EOF", () => {
  const src = "`abc\\"; // backslash at end
  const stream = new CharStream(src);
  const result = TemplateStringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(result.type).toBe("INVALID_TEMPLATE_STRING");
});

test("TemplateStringReader handles empty template", () => {
  const src = "``";
  const stream = new CharStream(src);
  const tok = TemplateStringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(2);
});

test("TemplateStringReader handles braces inside strings", () => {
  const src = "`a ${ '{' }`";
  const stream = new CharStream(src);
  const tok = TemplateStringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});


test("TemplateStringReader handles escaped backtick in expression", () => {
  const src = "`a ${`inner \\` backtick`}`";
  const stream = new CharStream(src);
  const tok = TemplateStringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
});

test("TemplateStringReader allows extra closing brace", () => {
  const src = "`a ${1}} b`";
  const stream = new CharStream(src);
  const tok = TemplateStringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader handles deeply nested templates", () => {
  const src = "`start ${`level1 ${`level2 ${3}`}`}`";
  const stream = new CharStream(src);
  const tok = TemplateStringReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("TEMPLATE_STRING");
  expect(tok.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});
