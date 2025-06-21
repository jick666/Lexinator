// src/plugins/importmeta/ImportMetaPlugin.js

import { ImportMetaReader } from '../../lexer/ImportMetaReader.js';
import { ImportCallReader } from '../../lexer/ImportCallReader.js';

export const ImportMetaPlugin = {
  // Declarative reader list (fallback)
  modes: { default: [ImportMetaReader, ImportCallReader] },

  init(engine) {
    engine.addReaders('default', ImportMetaReader, ImportCallReader);
  }
};
