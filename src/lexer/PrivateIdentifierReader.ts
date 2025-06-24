import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function PrivateIdentifierReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  if (stream.current() !== '#') return null;
  stream.advance();
  let ch = stream.current() as string | null;
  if (ch === null || !(/[A-Za-z_]/.test(ch))) {
    stream.setPosition(startPos);
    return null;
  }
  let value = '#';
  value += ch;
  stream.advance();
  ch = stream.current();
  while (ch !== null && /[A-Za-z0-9_]/.test(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  return factory('PRIVATE_IDENTIFIER', value, startPos, endPos);
}
