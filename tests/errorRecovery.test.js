import { CharStream } from "../src/lexer/CharStream.js";
import { LexerEngine } from "../src/lexer/LexerEngine.js";

// Error recovery should convert lexer errors into ERROR_TOKEN tokens

test("error recovery returns ERROR_TOKEN and continues", () => {
  const src = '"abc\nlet x';
  const engine = new LexerEngine(new CharStream(src), { errorRecovery: true });
  const t1 = engine.nextToken();
  expect(t1.type).toBe("ERROR_TOKEN");
  const t2 = engine.nextToken();
  expect(t2.type).toBe("WHITESPACE");
  const t3 = engine.nextToken();
  expect(t3.type).toBe("KEYWORD");
});

test("error recovery handles unterminated JSX", () => {
  const src = '<div';
  const engine = new LexerEngine(new CharStream(src), { errorRecovery: true });
  const tok = engine.nextToken();
  expect(tok.type).toBe("ERROR_TOKEN");
  expect(engine.nextToken()).toBeNull();
});
