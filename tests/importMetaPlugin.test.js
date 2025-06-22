import { createEngine } from './utils/testHelpers.js';
import { registerPlugin, clearPlugins } from '../src/index.js';
import { ImportMetaPlugin } from '../src/plugins/importmeta/ImportMetaPlugin.js';

afterEach(() => {
  clearPlugins();
});

test('ImportMetaPlugin tokenizes import.meta', () => {
  registerPlugin(ImportMetaPlugin);
  const engine = createEngine('import.meta.url;');
  const tok = engine.nextToken();
  expect(tok.type).toBe('IMPORT_META');
  expect(tok.value).toBe('import.meta');
});

test('ImportMetaPlugin tokenizes dynamic import', () => {
  registerPlugin(ImportMetaPlugin);
  const engine = createEngine("import('./mod.js')");
  const tok = engine.nextToken();
  expect(tok.type).toBe('IMPORT_CALL');
  expect(tok.value).toBe('import');
});
