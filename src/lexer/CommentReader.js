// src/lexer/CommentReader.js

export function CommentReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== '/') return null;
  const next = stream.peek();

  /* // … */
  if (next === '/') {
    const buf = ['/', '/'];
    stream.advance(); stream.advance();
    while (!stream.eof() && stream.current() !== '\n') { buf.push(stream.current()); stream.advance(); }
    return factory('COMMENT', buf.join(''), start, stream.getPosition());
  }

  /* /* … *\/ */
  if (next === '*') {
    const buf = ['/', '*'];
    stream.advance(); stream.advance();
    while (!stream.eof()) {
      const ch = stream.current();
      if (ch === '*' && stream.peek() === '/') {
        buf.push('*', '/'); stream.advance(); stream.advance();
        return factory('COMMENT', buf.join(''), start, stream.getPosition());
      }
      buf.push(ch); stream.advance();
    }
    /* EOF - unterminated */
    return factory('COMMENT', buf.join(''), start, stream.getPosition());
  }
  return null;
}
