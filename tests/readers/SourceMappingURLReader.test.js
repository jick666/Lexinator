import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { SourceMappingURLReader } from "../../src/lexer/SourceMappingURLReader.js";

test("SourceMappingURLReader reads external map line comment", () => {
  const stream = new CharStream("//# sourceMappingURL=foo.js.map\n");
  const tok = SourceMappingURLReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("SOURCE_MAPPING_URL");
  expect(tok.value).toBe("foo.js.map");
  expect(stream.current()).toBe("\n");
});

test("SourceMappingURLReader reads inline data URI", () => {
  const data = "data:application/json;base64,AAAA";
  const stream = new CharStream(`//# sourceMappingURL=${data}`);
  const tok = SourceMappingURLReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("SOURCE_MAPPING_URL");
  expect(tok.value).toBe(data);
  expect(stream.eof()).toBe(true);
});

test("SourceMappingURLReader reads block comment", () => {
  const stream = new CharStream("/*# sourceMappingURL=foo.js.map */");
  const tok = SourceMappingURLReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("SOURCE_MAPPING_URL");
  expect(tok.value).toBe("foo.js.map");
  expect(stream.eof()).toBe(true);
});

test("SourceMappingURLReader returns null when not a mapping comment", () => {
  const stream = new CharStream("// just a comment\n");
  const pos = stream.getPosition();
  const tok = SourceMappingURLReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
