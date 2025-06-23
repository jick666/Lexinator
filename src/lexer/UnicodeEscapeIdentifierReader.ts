import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { consumeIdentifierLike } from './utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function UnicodeEscapeIdentifierReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const start = stream.getPosition();
  const value = consumeIdentifierLike(stream, { unicode: true, allowEscape: true });
  if (value === null) return null;
  return factory('IDENTIFIER', value, start, stream.getPosition());
}
