import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { FunctionSentReader } from "../../src/lexer/FunctionSentReader.js";

test("FunctionSentReader reads function.sent", () => {
  const stream = new CharStream("function.sent");
  const tok = FunctionSentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("FUNCTION_SENT");
  expect(tok.value).toBe("function.sent");
});

test("FunctionSentReader returns null when sequence not matched", () => {
  const stream = new CharStream("function.send");
  const pos = stream.getPosition();
  const tok = FunctionSentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("FunctionSentReader returns null inside identifier", () => {
  const stream = new CharStream("myfunction.sent");
  stream.advance();
  stream.advance();
  const pos = stream.getPosition();
  const tok = FunctionSentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
