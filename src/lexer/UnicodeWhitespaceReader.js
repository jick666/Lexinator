// src/lexer/UnicodeWhitespaceReader.js

const WS_RE = /\p{White_Space}/u;

export function UnicodeWhitespaceReader(stream, factory) {
  const start = stream.getPosition();
  if (!WS_RE.test(stream.current() || '')) return null;

  const buf = [];
  while (!stream.eof() && WS_RE.test(stream.current())) { buf.push(stream.current()); stream.advance(); }
  return factory('WHITESPACE', buf.join(''), start, stream.getPosition());
}
