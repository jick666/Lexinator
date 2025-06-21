import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { registerPlugin, clearPlugins } from '../src/index.js';

function HashReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() === '#') {
    stream.advance();
    return factory('HASH', '#', start, stream.getPosition());
  }
  return null;
}

let initCalled = false;
const plugin = {
  modes: { default: [HashReader] },
  init() {
    initCalled = true;
  }
};

afterEach(() => {
  clearPlugins();
  initCalled = false;
});

test('registerPlugin adds reader', () => {
  registerPlugin(plugin);
  const engine = new LexerEngine(new CharStream('#'));
  const tok = engine.nextToken();
  expect(tok.type).toBe('HASH');
  expect(initCalled).toBe(true);
});

test('clearPlugins removes registered plugins', () => {
  registerPlugin(plugin);
  clearPlugins();
  const engine = new LexerEngine(new CharStream('#'));
  const tok = engine.nextToken();
  expect(tok).toBeNull();
  expect(initCalled).toBe(false);
});
