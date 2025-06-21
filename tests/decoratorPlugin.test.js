import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { registerPlugin, clearPlugins } from '../src/index.js';
import { DecoratorPlugin } from '../src/plugins/DecoratorPlugin.js';

afterEach(() => {
  clearPlugins();
});

test('TSDecoratorReader recognizes decorators', () => {
  registerPlugin(DecoratorPlugin);
  const engine = new LexerEngine(new CharStream('@Component'));
  const tok = engine.nextToken();
  expect(tok.type).toBe('DECORATOR');
  expect(tok.value).toBe('@Component');
});
