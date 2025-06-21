import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { BindOperatorReader } from "../../src/lexer/BindOperatorReader.js";

test("BindOperatorReader reads :: operator", () => {
  const stream = new CharStream("::");
  const tok = BindOperatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("BIND_OPERATOR");
  expect(tok.value).toBe("::");
});

test("BindOperatorReader returns null when sequence not matched", () => {
  const stream = new CharStream("?:");
  const pos = stream.getPosition();
  const tok = BindOperatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
