// src/lexer/UnicodeEscapeIdentifierReader.js

import { consumeIdentifierLike } from './utils.js';

export function UnicodeEscapeIdentifierReader(stream, factory) {
  const start = stream.getPosition();
  const value = consumeIdentifierLike(stream, { unicode: true, allowEscape: true });
  if (value === null) return null;
  return factory('IDENTIFIER', value, start, stream.getPosition());
}
