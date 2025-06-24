// src/lexer/ImportAssertionReader.js

import { consumeKeyword } from './utils.js';

export function ImportAssertionReader(stream, factory) {
  const start = stream.getPosition();
  const kwEnd = consumeKeyword(stream, 'assert');
  if (!kwEnd) return null;

  let value = 'assert';

  const next = stream.current();
  if (next !== ':' && next !== '{' && !/\s/.test(next)) { stream.setPosition(start); return null; }

  while (/\s/.test(stream.current() || '')) { value += stream.current(); stream.advance(); }

  if (stream.current() === ':') {
    value += ':'; stream.advance();
    while (/\s/.test(stream.current() || '')) { value += stream.current(); stream.advance(); }
  }

  if (stream.current() !== '{') { stream.setPosition(start); return null; }

  value += '{'; stream.advance();
  let depth = 1, inStr = null;
  while (!stream.eof() && depth) {
    const ch = stream.current(); value += ch; stream.advance();

    if (inStr) {
      if (ch === '\\') { if (!stream.eof()) { value += stream.current(); stream.advance(); } continue; }
      if (ch === inStr) inStr = null; continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++; else if (ch === '}') depth--;
  }
  if (depth) { stream.setPosition(start); return null; }
  return factory('IMPORT_ASSERTION', value, start, stream.getPosition());
}
