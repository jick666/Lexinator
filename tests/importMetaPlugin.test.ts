import { afterEach, expect, test } from '@jest/globals';
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
  expect(tok).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(tok!.type).toBe('IMPORT_META');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(tok!.value).toBe('import.meta');
});

test('ImportMetaPlugin tokenizes dynamic import', () => {
  registerPlugin(ImportMetaPlugin);
  const engine = new LexerEngine(new CharStream("import('./mod.js')"));
  const tok = engine.nextToken();
  expect(tok).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(tok!.type).toBe('IMPORT_CALL');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(tok!.value).toBe('import');
});
