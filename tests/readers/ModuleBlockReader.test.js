import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ModuleBlockReader } from "../../src/lexer/ModuleBlockReader.js";

const dummyEngine = {
  stateStack: ['default'],
  pushMode(mode) { this.stateStack.push(mode); },
  popMode() { this.stateStack.pop(); },
  currentMode() { return this.stateStack[this.stateStack.length - 1]; }
};

test("ModuleBlockReader reads module block start", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("module { }");
  const tok = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok.type).toBe("MODULE_BLOCK_START");
  expect(tok.value).toBe("module {");
  expect(engine.currentMode()).toBe("module_block");
});

test("ModuleBlockReader emits end token at closing brace", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("module { }");
  const startTok = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(startTok.type).toBe("MODULE_BLOCK_START");
  stream.advance();
  const tok = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok.type).toBe("MODULE_BLOCK_END");
  expect(engine.currentMode()).toBe("default");
});

test("ModuleBlockReader supports nested blocks", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("module { module { } }");
  const first = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(first.type).toBe("MODULE_BLOCK_START");
  stream.advance();
  const nested = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(nested.type).toBe("MODULE_BLOCK_START");
  stream.advance();
  const endNested = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(endNested.type).toBe("MODULE_BLOCK_END");
  stream.advance();
  const endOuter = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(endOuter.type).toBe("MODULE_BLOCK_END");
  expect(engine.currentMode()).toBe("default");
});

test("ModuleBlockReader returns null when not matched", () => {
  const engine = { ...dummyEngine, stateStack: ['default'] };
  const stream = new CharStream("mod {} ");
  const pos = stream.getPosition();
  const tok = ModuleBlockReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
