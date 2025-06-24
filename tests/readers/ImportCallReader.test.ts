import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ImportCallReader } from "../../src/lexer/ImportCallReader.js";

function run(src) {
  const stream = new CharStream(src);
  const tok = ImportCallReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  return { tok, stream };
}

test("ImportCallReader reads import call", () => {
  const { tok, stream } = run("import(foo)");
  expect(tok.type).toBe("IMPORT_CALL");
  expect(tok.value).toBe("import");
  expect(stream.current()).toBe("(");
});

test("ImportCallReader requires parentheses", () => {
  const stream = new CharStream("import foo");
  const pos = stream.getPosition();
  const tok = ImportCallReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("ImportCallReader returns null for non-matching text", () => {
  const stream = new CharStream("impost(");
  const pos = stream.getPosition();
  const tok = ImportCallReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
