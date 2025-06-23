import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { consumeKeyword } from './utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function ImportCallReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  const endPos = consumeKeyword(stream, 'import');
  if (!endPos) return null;

  if (stream.current() !== '(') {
    stream.setPosition(startPos);
    return null;
  }

  return factory('IMPORT_CALL', 'import', startPos, endPos);
}
