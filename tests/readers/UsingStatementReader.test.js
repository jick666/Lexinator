import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { UsingStatementReader } from "../../src/lexer/UsingStatementReader.js";

test("UsingStatementReader reads using", () => {
  const stream = new CharStream("using x");
  const tok = UsingStatementReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("USING");
  expect(tok.value).toBe("using");
  expect(stream.getPosition().index).toBe(5);
});

test("UsingStatementReader reads await using", () => {
  const stream = new CharStream("await using x");
  const tok = UsingStatementReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("AWAIT_USING");
  expect(tok.value).toBe("await using");
  expect(stream.getPosition().index).toBe(11);
});

test("UsingStatementReader returns null inside identifier", () => {
  const stream = new CharStream("abusing");
  stream.advance();
  stream.advance();
  const pos = stream.getPosition();
  const tok = UsingStatementReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
