// @ts-nocheck
import { afterEach, test, expect } from '@jest/globals';
import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { registerPlugin, clearPlugins } from '../src/index.js';
import { FlowTypePlugin } from '../src/plugins/flow/FlowTypePlugin.js';

afterEach(() => {
  clearPlugins();
});

test('FlowTypePlugin reads type annotations', () => {
  registerPlugin(FlowTypePlugin);
  const engine = new LexerEngine(new CharStream(': string'));
  const tok = engine.nextToken();
  expect(tok.type).toBe('TYPE_ANNOTATION');
  expect(tok.value).toBe(': string');
});

test('FlowTypePlugin keeps JSX enabled', () => {
  registerPlugin(FlowTypePlugin);
  const engine = new LexerEngine(new CharStream('<div/>'));
  const tok = engine.nextToken();
  expect(tok.type).toBe('JSX_TEXT');
});
