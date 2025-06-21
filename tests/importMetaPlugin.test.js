import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { registerPlugin, clearPlugins } from '../src/index.js';
import { ImportMetaPlugin } from '../src/plugins/importmeta/ImportMetaPlugin.js';

afterEach(() => {
  clearPlugins();
});

test('ImportMetaPlugin tokenizes import.meta', () => {
  registerPlugin(ImportMetaPlugin);
  const engine = new LexerEngine(new CharStream('import.meta.url;'));
  const tok = engine.nextToken();
  expect(tok.type).toBe('IMPORT_META');
  expect(tok.value).toBe('import.meta');
});

test('ImportMetaPlugin tokenizes dynamic import', () => {
  registerPlugin(ImportMetaPlugin);
  const engine = new LexerEngine(new CharStream("import('./mod.js')"));
  const tok = engine.nextToken();
  expect(tok.type).toBe('IMPORT_CALL');
  expect(tok.value).toBe('import');
});
