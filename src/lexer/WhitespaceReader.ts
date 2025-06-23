import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

const WS = new Set([' ', '\n', '\t', '\r', '\v', '\f']);

export function WhitespaceReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const start = stream.getPosition();
  if (!WS.has(stream.current())) return null;

  const buf: string[] = [];
  while (!stream.eof() && WS.has(stream.current() as string)) {
    buf.push(stream.current() as string);
    stream.advance();
  }
  return factory('WHITESPACE', buf.join(''), start, stream.getPosition());
}
