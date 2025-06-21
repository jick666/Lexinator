// src/lexer/UnicodeIdentifierReader.js

import { consumeIdentifierLike } from './utils.js';

export function UnicodeIdentifierReader(stream, factory) {
  // Fast bail-out: ASCII handled by IdentifierReader.
  if (stream.current() === null || stream.current().charCodeAt(0) < 128) return null;

  const start = stream.getPosition();
  const value = consumeIdentifierLike(stream, { unicode: true });
  if (value === null) return null;
  return factory('IDENTIFIER', value, start, stream.getPosition());
}
