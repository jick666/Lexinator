import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { consumeKeyword } from './utils.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function ImportMetaReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  const endPos = consumeKeyword(stream, 'import.meta', { checkPrev: false });
  if (!endPos) return null;
  return factory('IMPORT_META', 'import.meta', startPos, endPos);
}
