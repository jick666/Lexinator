// src/lexer/CommentReader.ts
import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function CommentReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
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
