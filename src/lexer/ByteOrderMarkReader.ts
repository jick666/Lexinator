import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function ByteOrderMarkReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  if (stream.index !== 0) return null;
  if (stream.current() !== '\uFEFF') return null;
  stream.advance();
  const endPos = stream.getPosition();
  return factory('BOM', '\uFEFF', startPos, endPos);
}
