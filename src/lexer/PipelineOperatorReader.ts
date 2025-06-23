import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function PipelineOperatorReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();

  // “|>” must be contiguous – no whitespace is permitted inside the token.
  if (stream.current() === '|' && stream.peek() === '>') {
    stream.advance(); // '|'
    stream.advance(); // '>'
    const endPos = stream.getPosition();
    return factory('PIPELINE_OPERATOR', '|>', startPos, endPos);
  }
  return null;
}
