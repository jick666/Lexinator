import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function ShebangReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  if (stream.index !== 0) return null;
  if (stream.current() !== '#' || stream.peek() !== '!') return null;

  let value = '';
  while (!stream.eof() && stream.current() !== '\n') {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('COMMENT', value, startPos, endPos);
}
