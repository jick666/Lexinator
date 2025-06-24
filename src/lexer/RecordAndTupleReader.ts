import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function RecordAndTupleReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  if (stream.current() !== '#') return null;
  const next = stream.peek();
  if (next !== '{' && next !== '[') return null;
  stream.advance();
  stream.advance();
  const endPos = stream.getPosition();
  const type = next === '{' ? 'RECORD_START' : 'TUPLE_START';
  const value = next === '{' ? '#{' : '#[';
  return factory(type, value, startPos, endPos);
}
