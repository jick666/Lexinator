// src/lexer/IdentifierReader.js

import { consumeIdentifierLike } from './utils.js';

export function IdentifierReader(stream, factory) {
  const start = stream.getPosition();
  const value = consumeIdentifierLike(stream, { unicode: false });
  if (value === null) return null;
  return factory('IDENTIFIER', value, start, stream.getPosition());
}

export const IdentifierReaderClass = IdentifierReader;
