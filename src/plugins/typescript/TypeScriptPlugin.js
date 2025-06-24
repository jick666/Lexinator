// src/plugins/typescript/TypeScriptPlugin.js

import { TSDecoratorReader } from '../common/TSDecoratorReader.js';
import { createTypeAnnotationReader } from '../common/TypeAnnotationReader.js';
import { createPlugin } from '../pluginUtils.js';

export const TSTypeAnnotationReader = createTypeAnnotationReader();

export function TSGenericParameterReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== '<') return null;

  // Disable JSX heuristics when generic parameters are active
  let value = '<';
  stream.advance();
  let depth = 1;

  while (!stream.eof()) {
    const ch = stream.current();
    value += ch;
    stream.advance();
    if (ch === '<') depth++;
    else if (ch === '>') {
      depth--;
      if (depth === 0) break;
    }
  }
  return factory('TYPE_PARAMETER', value, start, stream.getPosition());
}

export const TypeScriptPlugin = createPlugin(
  [TSDecoratorReader, TSTypeAnnotationReader, TSGenericParameterReader],
  engine => {
    engine.disableJsx = true;
  }
);
