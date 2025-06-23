import type { CharStream } from '../CharStream.js';
import type { Token } from '../Token.js';
import { readDigitsWithUnderscores, isDigit } from '../utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function NumericSeparatorReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDigit(ch)) return null;

  const result = readDigitsWithUnderscores(stream, startPos);
  if (!result) return null;
  const { value, underscoreSeen, lastUnderscore } = result;

  if (!underscoreSeen || lastUnderscore) {
    stream.setPosition(startPos);
    return null;
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
