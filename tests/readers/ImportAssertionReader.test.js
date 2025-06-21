import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ImportAssertionReader } from "../../src/lexer/ImportAssertionReader.js";

test("ImportAssertionReader reads assert clause", () => {
  const stream = new CharStream("assert { type: 'json' }");
  const tok = ImportAssertionReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("IMPORT_ASSERTION");
  expect(tok.value).toBe("assert { type: 'json' }");
});

test("ImportAssertionReader reads with colon syntax", () => {
  const stream = new CharStream("assert: { type: 'json' }");
  const tok = ImportAssertionReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("IMPORT_ASSERTION");
  expect(tok.value).toBe("assert: { type: 'json' }");
});

test("ImportAssertionReader returns null for non-matching text", () => {
  const stream = new CharStream("assert true");
  const pos = stream.getPosition();
  const tok = ImportAssertionReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
