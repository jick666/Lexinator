import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { registerPlugin, clearPlugins } from '../src/index.js';
import { TypeScriptPlugin } from '../src/plugins/typescript/TypeScriptPlugin.js';

afterEach(() => {
  clearPlugins();
});

test('TypeScriptPlugin reads decorators', () => {
  registerPlugin(TypeScriptPlugin);
  const engine = new LexerEngine(new CharStream('@Comp'));
  const tok = engine.nextToken();
  expect(tok.type).toBe('DECORATOR');
});

test('TypeScriptPlugin reads type annotations', () => {
  registerPlugin(TypeScriptPlugin);
  const engine = new LexerEngine(new CharStream(': number'));
  const tok = engine.nextToken();
  expect(tok.type).toBe('TYPE_ANNOTATION');
  expect(tok.value).toBe(': number');
});

test('TypeScriptPlugin parses generic parameters without JSX', () => {
  registerPlugin(TypeScriptPlugin);
  const engine = new LexerEngine(new CharStream('Map<string>'));
  const ident = engine.nextToken();
  expect(ident.type).toBe('IDENTIFIER');
  const generic = engine.nextToken();
  expect(generic.type).toBe('TYPE_PARAMETER');
});

test('TSGenericParameterReader handles nested generics', () => {
  registerPlugin(TypeScriptPlugin);
  const engine = new LexerEngine(new CharStream('Map<Map<string>>'));
  engine.nextToken(); // IDENTIFIER
  const tok = engine.nextToken();
  expect(tok.value).toBe('<Map<string>>');
});

test('TSGenericParameterReader returns null when not at <', async () => {
  registerPlugin(TypeScriptPlugin);
  const { TSGenericParameterReader } = await import('../src/plugins/typescript/TypeScriptPlugin.js');
  const stream = new CharStream('A');
  expect(TSGenericParameterReader(stream, () => {})).toBeNull();
});
