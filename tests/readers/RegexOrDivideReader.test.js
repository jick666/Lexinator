// tests/readers/RegexOrDivideReader.test.js

import { CharStream }          from "../../src/lexer/CharStream.js";
import { Token }               from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";
import { CommentReader }       from "../../src/lexer/CommentReader.js";

const mk = (t, v, s, e) => new Token(t, v, s, e);   // tiny factory

/* helper: advance until we sit on the first `ch` */
function seek(stream, ch) {
  while (!stream.eof() && stream.current() !== ch) stream.advance();
  if (stream.current() !== ch) throw new Error(`seek(): '${ch}' not found`);
}

/* ─────────────────────────────────────────────────────────────
 *  Basic operators
 * ──────────────────────────────────────────────────────────── */
test("divide operator", () => {
  const s = new CharStream("a/b"); s.advance();       // skip 'a'
  const tok = RegexOrDivideReader(s, mk);
  expect(tok).toMatchObject({ type: "OPERATOR", value: "/" });
});

test("'/=' operator", () => {
  const tok = RegexOrDivideReader(new CharStream("/=x"), mk);
  expect(tok).toMatchObject({ type: "OPERATOR", value: "/=" });
});

/* ─────────────────────────────────────────────────────────────
 *  Regex literals – happy path
 * ──────────────────────────────────────────────────────────── */
test("simple regex literal", () => {
  const tok = RegexOrDivideReader(new CharStream("/abc/g"), mk);
  expect(tok).toMatchObject({ type: "REGEX", value: "/abc/g" });
});

test("escaped slash", () => {
  expect(RegexOrDivideReader(new CharStream("/a\\/b/i"), mk).value)
    .toBe("/a\\/b/i");
});

test("character class", () => {
  expect(RegexOrDivideReader(new CharStream("/[a-z]/g"), mk).value)
    .toBe("/[a-z]/g");
});

test("slash inside class", () => {
  expect(RegexOrDivideReader(new CharStream("/[a\\/b]/"), mk).value)
    .toBe("/[a\\/b]/");
});

test("quantifiers and nested groups", () => {
  const src = "/a{2,3}(b[c]+)*/g";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

test("escaped closing bracket", () => {
  const src = "/[a-z\\]]+/";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

test("named capture groups", () => {
  expect(
    RegexOrDivideReader(new CharStream("/foo(?<name>bar)/"), mk).value
  ).toBe("/foo(?<name>bar)/");
});

test("multiple named capture groups", () => {
  const src = "/(?<foo>a)(?<bar>b)/";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

test("look-behind assertion", () => {
  const src = "/(?<=foo)bar/";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

test("newline in regex literal", () => {
  const src = "/a\nb/";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

/* ─────────────────────────────────────────────────────────────
 *  Unicode-property escapes – fast-scan vs. validation
 * ──────────────────────────────────────────────────────────── */
test("fast-scan accepts unknown Unicode property", () => {
  const tok = RegexOrDivideReader(new CharStream("/\\p{Unknown}/u"), mk);
  expect(tok.type).toBe("REGEX");
});

test("opt-in validation rejects unknown Unicode property", () => {
  const tok = RegexOrDivideReader(
    new CharStream("/\\p{Unknown}/u"),
    mk,
    { validateUnicodeProperties: true }
  );
  expect(tok.type).toBe("INVALID_REGEX");
});

test("valid Unicode property escape", () => {
  const src = "/\\p{Letter}+/u";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

test("negative Unicode property", () => {
  const src = "/\\P{Script=Latin}/u";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

test("Unicode set with v-flag", () => {
  const src = "/[\\p{Script=Latin}--[a-z]]/v";
  expect(RegexOrDivideReader(new CharStream(src), mk).value).toBe(src);
});

/* ─────────────────────────────────────────────────────────────
 *  Newline context heuristic
 * ──────────────────────────────────────────────────────────── */
test("newline after starter → regex", () => {
  const s = new CharStream("1+\n/foo/");
  seek(s, '/');
  const tok = RegexOrDivideReader(s, mk);
  expect(tok).toMatchObject({ type: "REGEX", value: "/foo/" });
});

test("newline after identifier → divide", () => {
  const s = new CharStream("a\n/b/");
  seek(s, '/');
  const tok = RegexOrDivideReader(s, mk);
  expect(tok).toMatchObject({ type: "OPERATOR", value: "/" });
});

test("newline after ')' → divide", () => {
  const s = new CharStream("(1)\n/abc/");
  seek(s, '/');
  const tok = RegexOrDivideReader(s, mk);
  expect(tok).toMatchObject({ type: "OPERATOR", value: "/" });
});

/* ─────────────────────────────────────────────────────────────
 *  Slash after comments
 * ──────────────────────────────────────────────────────────── */
test("slash after block comment → divide", () => {
  const s = new CharStream("x/*c*/ /y/");
  s.advance();                         // 'x'
  CommentReader(s, () => {});          // consume /*c*/
  s.advance();                         // space
  const tok = RegexOrDivideReader(s, mk);
  expect(tok).toMatchObject({ type: "OPERATOR", value: "/" });
});

test("slash after line comment → divide", () => {
  const s = new CharStream("x//c\na/b/");
  s.advance();                         // 'x'
  CommentReader(s, () => {});          // consume //
  s.advance();                         // '\n'
  seek(s, '/');                        // ⬅️  key fix
  const tok = RegexOrDivideReader(s, mk);
  expect(tok).toMatchObject({ type: "OPERATOR", value: "/" });
});

/* ─────────────────────────────────────────────────────────────
 *  Invalid cases
 * ──────────────────────────────────────────────────────────── */
test("unterminated regex literal", () => {
  const tok = RegexOrDivideReader(new CharStream("/abc"), mk);
  expect(tok.type).toBe("INVALID_REGEX");
});

test("unterminated char-class", () => {
  const tok = RegexOrDivideReader(new CharStream("/[abc/"), mk);
  expect(tok.type).toBe("INVALID_REGEX");
});

test("unterminated nested char-class (v-flag)", () => {
  const tok = RegexOrDivideReader(new CharStream("/[a[b]/v"), mk);
  expect(tok.type).toBe("INVALID_REGEX");
});

test("invalid capture-group name", () => {
  const tok = RegexOrDivideReader(new CharStream("/(?<1bad>x)/"), mk);
  expect(tok.type).toBe("INVALID_REGEX");
});
