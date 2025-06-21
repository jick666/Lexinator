import { tokenize } from "../src/index.js";

test("integration: var declaration", () => {
  const toks = tokenize("let x = 5;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
});

test("integration: trailing whitespace does not produce null token", () => {
  const toks = tokenize("let x = 5;   ");
  expect(toks).not.toContain(null);
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
});

test("integration: tokenize returns INVALID_REGEX token on unterminated regex", () => {
  const toks = tokenize("/abc");
  expect(toks[0].type).toBe("INVALID_REGEX");
});

test("integration: tokenize throws on unterminated template", () => {
  expect(() => tokenize("`oops")).toThrow();
});

test("integration: bigint and optional chaining", () => {
  const toks = tokenize("let x = 1n ?? obj?.prop;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "BIGINT",
    "OPERATOR",
    "IDENTIFIER",
    "OPERATOR",
    "IDENTIFIER",
    "PUNCTUATION"
  ]);
});

test("integration: hex literals", () => {
  const toks = tokenize("let n = 0x1A;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
  expect(toks[3].value).toBe("0x1A");
});

test("integration: numeric separator with exponent splits tokens", () => {
  const toks = tokenize("let n = 1_0e3;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "IDENTIFIER",
    "PUNCTUATION"
  ]);
});

test("integration: binary literal", () => {
  const toks = tokenize("let n = 0b1010;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
  expect(toks[3].value).toBe("0b1010");
});

test("integration: octal literal", () => {
  const toks = tokenize("let n = 0o755;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
  expect(toks[3].value).toBe("0o755");
});

test("integration: exponent literal", () => {
  const toks = tokenize("let n = 1e3;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
  expect(toks[3].value).toBe("1e3");
});

test("integration: unicode identifiers", () => {
  const toks = tokenize("let πδ = 1;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
  expect(toks[1].value).toBe("πδ");
});

test("integration: shebang comment", () => {
  const src = "#!/usr/bin/env node\nlet a = 1;";
  const toks = tokenize(src);
  expect(toks[0].type).toBe("COMMENT");
  expect(toks[0].value).toBe("#!/usr/bin/env node");
});

test("integration: byte order mark", () => {
  const src = "\uFEFFlet a = 1;";
  const toks = tokenize(src);
  expect(toks[0].type).toBe("BOM");
  expect(toks[1].type).toBe("KEYWORD");
});

test("integration: html comments", () => {
  const src = "<!-- hidden -->\nlet a = 1;";
  const toks = tokenize(src);
  expect(toks[0].type).toBe("COMMENT");
  expect(toks[0].value).toBe("<!-- hidden -->");
});

test("integration: pipeline operator", () => {
  const toks = tokenize("a |> b");
  expect(toks.map(t => t.type)).toEqual([
    "IDENTIFIER",
    "PIPELINE_OPERATOR",
    "IDENTIFIER"
  ]);
});

test("integration: bind operator", () => {
  const toks = tokenize("obj::method");
  expect(toks.map(t => t.type)).toEqual([
    "IDENTIFIER",
    "BIND_OPERATOR",
    "IDENTIFIER"
  ]);
});

test("integration: private identifiers", () => {
  const toks = tokenize("class C { #a; #b() {} }");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "PUNCTUATION",
    "PRIVATE_IDENTIFIER",
    "PUNCTUATION",
    "PRIVATE_IDENTIFIER",
    "PUNCTUATION",
    "PUNCTUATION",
    "PUNCTUATION",
    "PUNCTUATION",
    "PUNCTUATION"
  ]);
});

test("integration: import assertions", () => {
  const src = 'import data from "./d.json" assert { type: "json" };';
  const toks = tokenize(src);
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "IDENTIFIER",
    "STRING",
    "IMPORT_ASSERTION",
    "PUNCTUATION"
  ]);
});

test("integration: dynamic import assertions", () => {
  const src = 'import("./d.json", { assert: { type: "json" } });';
  const toks = tokenize(src);
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "PUNCTUATION",
    "STRING",
    "PUNCTUATION",
    "PUNCTUATION",
    "IMPORT_ASSERTION",
    "PUNCTUATION",
    "PUNCTUATION",
    "PUNCTUATION"
  ]);
});

test("integration: record and tuple literals", () => {
  const toks = tokenize("#{a:1} #[1]");
  expect(toks.map(t => t.type)).toEqual([
    "RECORD_START",
    "IDENTIFIER",
    "NUMBER",
    "PUNCTUATION",
    "TUPLE_START",
    "NUMBER",
    "PUNCTUATION"
  ]);
});

test("integration: module blocks", () => {
  const toks = tokenize("module { let x = 1; }");
  expect(toks.map(t => t.type)).toEqual([
    "MODULE_BLOCK_START",
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION",
    "MODULE_BLOCK_END"
  ]);
});

test("integration: using statement", () => {
  const toks = tokenize("using x = foo();");
  expect(toks[0].type).toBe("USING");
});

test("integration: await using statement", () => {
  const toks = tokenize("await using y = bar();");
  expect(toks[0].type).toBe("AWAIT_USING");
});

test("integration: pattern matching tokens", () => {
  const toks = tokenize("match (x) { case 1: }");
  expect(toks.map(t => t.type)).toEqual([
    "MATCH",
    "PUNCTUATION",
    "IDENTIFIER",
    "PUNCTUATION",
    "PUNCTUATION",
    "CASE",
    "NUMBER",
    "PUNCTUATION"
  ]);
});

test("integration: function.sent meta property", () => {
  const toks = tokenize("function.sent;");
  expect(toks.map(t => t.type)).toEqual([
    "FUNCTION_SENT",
    "PUNCTUATION"
  ]);
});
