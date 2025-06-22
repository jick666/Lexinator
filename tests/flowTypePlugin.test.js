import { createEngine } from './utils/testHelpers.js';
import { registerPlugin, clearPlugins } from '../src/index.js';
import { FlowTypePlugin } from '../src/plugins/flow/FlowTypePlugin.js';

afterEach(() => {
  clearPlugins();
});

test('FlowTypePlugin reads type annotations', () => {
  registerPlugin(FlowTypePlugin);
  const engine = createEngine(': string');
  const tok = engine.nextToken();
  expect(tok.type).toBe('TYPE_ANNOTATION');
  expect(tok.value).toBe(': string');
});

test('FlowTypePlugin keeps JSX enabled', () => {
  registerPlugin(FlowTypePlugin);
  const engine = createEngine('<div/>');
  const tok = engine.nextToken();
  expect(tok.type).toBe('JSX_TEXT');
});
