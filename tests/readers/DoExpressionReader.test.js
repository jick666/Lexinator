import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { DoExpressionReader } from "../../src/lexer/DoExpressionReader.js";

const dummyEngine = {
  stateStack: ['default'],
  pushMode(mode) { this.stateStack.push(mode); },
  popMode() { this.stateStack.pop(); },
  currentMode() { return this.stateStack[this.stateStack.length - 1]; }
};

test("DoExpressionReader reads do block start", () => {
  const stream = new CharStream("do { x }");
  const tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), dummyEngine);
  expect(tok.type).toBe("DO_BLOCK_START");
  expect(tok.value).toBe("do {");
  expect(dummyEngine.currentMode()).toBe("do_block");
});

test("DoExpressionReader handles whitespace before brace", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("do   {\n}");
  const tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok.type).toBe("DO_BLOCK_START");
  expect(engine.currentMode()).toBe("do_block");
});

test("DoExpressionReader emits end token at closing brace", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("do { }");
  const startTok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(startTok.type).toBe("DO_BLOCK_START");
  stream.advance();
  const tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok.type).toBe("DO_BLOCK_END");
  expect(engine.currentMode()).toBe("default");
});

test("DoExpressionReader tracks nested blocks", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("do { do { } }");
  const first = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(first.type).toBe("DO_BLOCK_START");
  stream.advance();
  const nested = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(nested.type).toBe("DO_BLOCK_START");
  stream.advance();
  const endNested = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(endNested.type).toBe("DO_BLOCK_END");
  stream.advance();
  const endOuter = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(endOuter.type).toBe("DO_BLOCK_END");
  expect(engine.currentMode()).toBe("default");
});

test("DoExpressionReader returns null without brace", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("do value");
  const pos = stream.getPosition();
  const tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("DoExpressionReader handles inner braces depth", () => {
  const engine = { ...dummyEngine, stateStack: ['do_block'], doBlockDepth: 0 };
  const stream = new CharStream("{ }");
  let tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok).toBeNull();
  expect(engine.doBlockDepth).toBe(1);
  stream.advance(); // skip '{'
  stream.advance(); // move to '}'
  tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok).toBeNull();
  expect(engine.doBlockDepth).toBe(0);
});
