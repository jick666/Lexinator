// src/lexer/JSXReader.js

import { LexerError } from './LexerError.js';

export function JSXReader(stream, factory, engine) {
  if (stream.current() !== '<') return null;
  const start = stream.getPosition();
  const buf   = [];
  let depth = 0, brace = 0, quote = null;

  while (!stream.eof()) {
    const ch = stream.current();
    buf.push(ch);

    if (quote) {                            // in quoted attr
      if (ch === '\\') { stream.advance(); if (!stream.eof()) { buf.push(stream.current()); stream.advance(); } continue; }
      if (ch === quote) quote = null;
      stream.advance(); continue;
    }

    if (ch === '"' || ch === "'") { quote = ch; stream.advance(); continue; }
    if (ch === '{') { brace++; stream.advance(); continue; }
    if (ch === '}') { if (brace) brace--; stream.advance(); continue; }

    if (!brace) {                           // only when top-level text
      if (ch === '<') { depth++; stream.advance(); continue; }
      if (ch === '/' && stream.peek() === '>') {
        buf.push('>'); stream.advance(); stream.advance(); depth--;
        if (depth <= 0) { engine?.popMode?.(); return factory('JSX_TEXT', buf.join(''), start, stream.getPosition()); }
        continue;
      }
      if (ch === '>') {
        depth--; stream.advance();
        if (depth <= 0) { engine?.popMode?.(); return factory('JSX_TEXT', buf.join(''), start, stream.getPosition()); }
        continue;
      }
    }
    stream.advance();
  }
  return new LexerError('UnterminatedJSX','Unterminated JSX element',start,stream.getPosition(),stream.input);
}
