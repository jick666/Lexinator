// src/plugins/importmeta/ImportMetaPlugin.js

import { ImportMetaReader } from '../../lexer/ImportMetaReader.js';
import { ImportCallReader } from '../../lexer/ImportCallReader.js';
import { createPlugin } from '../pluginUtils.js';

export const ImportMetaPlugin = createPlugin([
  ImportMetaReader,
  ImportCallReader
]);
