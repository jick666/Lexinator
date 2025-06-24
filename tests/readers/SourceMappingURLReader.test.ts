import { CharStream } from "../../src/lexer/CharStream.js";
import { SourceMappingURLReader } from "../../src/lexer/SourceMappingURLReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("SourceMappingURLReader reads external map line comment", () => {
  const stream = new CharStream("//# sourceMappingURL=foo.js.map\n");
  const { token } = runReader(SourceMappingURLReader, undefined, undefined, stream);
  expect(token.type).toBe("SOURCE_MAPPING_URL");
  expect(token.value).toBe("foo.js.map");
  expect(stream.current()).toBe("\n");
});

test("SourceMappingURLReader reads inline data URI", () => {
  const data = "data:application/json;base64,AAAA";
  const { token, stream } = runReader(SourceMappingURLReader, `//# sourceMappingURL=${data}`);
  expect(token.type).toBe("SOURCE_MAPPING_URL");
  expect(token.value).toBe(data);
  expect(stream.eof()).toBe(true);
});

test("SourceMappingURLReader reads block comment", () => {
  const { token, stream } = runReader(SourceMappingURLReader, "/*# sourceMappingURL=foo.js.map */");
  expect(token.type).toBe("SOURCE_MAPPING_URL");
  expect(token.value).toBe("foo.js.map");
  expect(stream.eof()).toBe(true);
});

test("SourceMappingURLReader returns null when not a mapping comment", () => {
  const stream = new CharStream("// just a comment\n");
  const pos = stream.getPosition();
  const { token } = runReader(SourceMappingURLReader, undefined, undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
