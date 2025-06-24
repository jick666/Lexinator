import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ShebangReader } from "../../src/lexer/ShebangReader.js";

test("ShebangReader reads shebang at file start", () => {
  const src = "#!/usr/bin/env node\nconsole.log('hi');";
  const stream = new CharStream(src);
  const token = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("#!/usr/bin/env node");
  expect(stream.current()).toBe("\n");
});

test("ShebangReader returns null when not at start", () => {
  const stream = new CharStream("console.log('hi');");
  expect(ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e))).toBeNull();
});

test("ShebangReader returns null when start does not include '!'", () => {
  const src = "# just text";
  const stream = new CharStream(src);
  const pos = stream.getPosition();
  const result = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(result).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("ShebangReader handles EOF without newline", () => {
  const src = "#!/bin/bash";
  const stream = new CharStream(src);
  const token = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe(src);
  expect(stream.eof()).toBe(true);
});

test("ShebangReader handles CRLF line endings", () => {
  const src = "#!/usr/bin/env node\r\nconsole.log('hi');";
  const stream = new CharStream(src);
  const token = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("#!/usr/bin/env node\r");
  expect(stream.current()).toBe("\n");
});

test("ShebangReader ignores BOM at start", () => {
  const src = "\uFEFF#!/bin/bash";
  const stream = new CharStream(src);
  const pos = stream.getPosition();
  const result = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(result).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
  stream.advance(); // consume BOM
  const tok = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
});

test("ShebangReader consumes spaces after hashbang", () => {
  const src = "#! /usr/bin/env node\n";
  const stream = new CharStream(src);
  const token = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("#! /usr/bin/env node");
  expect(stream.current()).toBe("\n");
});
