import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { CommentReader } from "../../src/lexer/CommentReader.js";

test("CommentReader reads // line comment", () => {
  const src = "//hello\n";
  const stream = new CharStream(src);
  const token = CommentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("//hello");
  expect(stream.getPosition().index).toBe(7); // position before newline
});

test("CommentReader reads /* block comment */", () => {
  const src = "/* block */ rest";
  const stream = new CharStream(src);
  const token = CommentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("/* block */");
  expect(stream.getPosition().index).toBe(11);
});

test("CommentReader handles unterminated block comment at EOF", () => {
  const src = "/* unterminated";
  const stream = new CharStream(src);
  const token = CommentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe(src);
  expect(stream.eof()).toBe(true);
});

test("CommentReader handles line comment at EOF", () => {
  const src = "// end";
  const stream = new CharStream(src);
  const token = CommentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("COMMENT");
  expect(token.value).toBe("// end");
  expect(stream.eof()).toBe(true);
});
