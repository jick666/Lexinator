import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { HTMLCommentReader } from "../../src/lexer/HTMLCommentReader.js";

test("HTMLCommentReader reads <!-- at line start", () => {
  const src = "<!-- hello\nlet a = 1;";
  const stream = new CharStream(src);
  const tok = HTMLCommentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("COMMENT");
  expect(tok.value).toBe("<!-- hello");
  expect(stream.current()).toBe("\n");
});

test("HTMLCommentReader reads --> at line start", () => {
  const src = "--> end\n";
  const stream = new CharStream(src);
  const tok = HTMLCommentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("COMMENT");
  expect(tok.value).toBe("--> end");
  expect(stream.current()).toBe("\n");
});

test("HTMLCommentReader returns null mid-line", () => {
  const src = "var a; <!-- hi";
  const stream = new CharStream(src);
  for (let i = 0; i < 7; i++) stream.advance();
  const pos = stream.getPosition();
  const tok = HTMLCommentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
