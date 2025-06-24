import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function BindOperatorReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  if (stream.current() === ':' && stream.peek() === ':') {
    stream.advance();
    stream.advance();
    const endPos = stream.getPosition();
    return factory('BIND_OPERATOR', '::', startPos, endPos);
  }
  return null;
}
