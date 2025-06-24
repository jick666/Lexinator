import type { Plugin } from '../../pluginManager.js';
import { ImportMetaReader } from '../../lexer/ImportMetaReader.js';
import { ImportCallReader } from '../../lexer/ImportCallReader.js';

export const ImportMetaPlugin: Plugin = {
  // Declarative reader list (fallback)
  modes: { default: [ImportMetaReader, ImportCallReader] },

  init(engine: any) {
    engine.addReaders('default', ImportMetaReader, ImportCallReader);
  }
};
