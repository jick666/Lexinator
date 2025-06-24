import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

const WS_RE = /\p{White_Space}/u;

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function UnicodeWhitespaceReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const start = stream.getPosition();
  if (!WS_RE.test(stream.current() || '')) return null;

  const buf: string[] = [];
  while (!stream.eof() && WS_RE.test(stream.current() as string)) {
    buf.push(stream.current() as string);
    stream.advance();
  }
  return factory('WHITESPACE', buf.join(''), start, stream.getPosition());
}
