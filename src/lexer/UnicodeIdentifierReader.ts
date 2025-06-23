import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { consumeIdentifierLike } from './utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function UnicodeIdentifierReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  // Fast bail-out: ASCII handled by IdentifierReader.
  if (stream.current() === null || stream.current()!.charCodeAt(0) < 128) return null;

  const start = stream.getPosition();
  const value = consumeIdentifierLike(stream, { unicode: true });
  if (value === null) return null;
  return factory('IDENTIFIER', value, start, stream.getPosition());
}
