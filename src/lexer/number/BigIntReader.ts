import type { CharStream } from '../CharStream.js';
import type { Token } from '../Token.js';
import { readDigitsWithUnderscores, isDigit } from '../utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function BigIntReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDigit(ch)) return null;

  // verify there is a trailing 'n' so this is really a bigint
  let idx = stream.index;
  while (idx < stream.input.length && /[0-9_]/.test(stream.input[idx])) {
    idx++;
  }
  if (stream.input[idx] !== 'n') return null;

  const result = readDigitsWithUnderscores(stream, startPos);
  if (!result) return null;
  let { value, underscoreSeen, lastUnderscore } = result;
  ch = stream.current();

  if (lastUnderscore) {
    stream.setPosition(startPos);
    return null;
  }

  if (underscoreSeen && value.startsWith('_')) {
    stream.setPosition(startPos);
    return null;
  }

  if (ch !== 'n') {
    stream.setPosition(startPos);
    return null;
  }

  value += 'n';
  stream.advance();
  const endPos = stream.getPosition();
  return factory('BIGINT', value, startPos, endPos);
}
