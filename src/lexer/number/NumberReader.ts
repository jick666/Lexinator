// §4.2 NumberReader
import type { CharStream } from '../CharStream.js';
import type { Token } from '../Token.js';
import { readNumberLiteral, isDigit } from '../utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function NumberReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  if (!isDigit(stream.current())) return null;

  const result = readNumberLiteral(stream, startPos);
  if (!result) return null;
  const { value } = result;
  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
