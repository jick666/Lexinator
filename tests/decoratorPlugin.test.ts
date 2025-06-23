import { afterEach, expect, test } from '@jest/globals';
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
  expect(tok).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(tok!.type).toBe('DECORATOR');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(tok!.value).toBe('@Component');
});
