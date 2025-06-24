import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { PrivateIdentifierReader } from "../../src/lexer/PrivateIdentifierReader.js";

test("PrivateIdentifierReader reads #name", () => {
  const stream = new CharStream("#name");
  const tok = PrivateIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("PRIVATE_IDENTIFIER");
  expect(tok.value).toBe("#name");
});

test("PrivateIdentifierReader returns null when invalid", () => {
  const stream = new CharStream("# 1");
  const pos = stream.getPosition();
  const tok = PrivateIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
