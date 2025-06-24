import type { CharStream } from '../CharStream.js';
import type { Token } from '../Token.js';
import { readNumberLiteral, readDigits, isDigit } from '../utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function ExponentReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  if (!isDigit(stream.current())) return null;

  const numberResult = readNumberLiteral(stream, startPos);
  if (!numberResult) return null;
  let { value, ch } = numberResult;

  if (ch !== 'e' && ch !== 'E') {
    stream.setPosition(startPos);
    return null;
  }

  value += ch;
  stream.advance();
  ch = stream.current();

  if (ch === '+' || ch === '-') {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const exponent = readDigits(stream);
  if (exponent.length === 0) {
    stream.setPosition(startPos);
    return null;
  }
  value += exponent;

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
