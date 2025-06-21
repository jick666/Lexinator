import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ByteOrderMarkReader } from "../../src/lexer/ByteOrderMarkReader.js";

test("ByteOrderMarkReader consumes BOM at file start", () => {
  const stream = new CharStream("\uFEFFlet a = 1;");
  const tok = ByteOrderMarkReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("BOM");
  expect(tok.value).toBe("\uFEFF");
  expect(stream.getPosition().index).toBe(1);
});

test("ByteOrderMarkReader returns null when not at start", () => {
  const stream = new CharStream("let a = 1;\uFEFF");
  stream.advance();
  const pos = stream.getPosition();
  const tok = ByteOrderMarkReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
