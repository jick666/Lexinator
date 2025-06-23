import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function PunctuationReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  const ch = stream.current();
  if (JavaScriptGrammar.punctuationSet.has(ch as string)) {
    stream.advance();
    const endPos = stream.getPosition();
    return factory('PUNCTUATION', ch as string, startPos, endPos);
  }
  return null;
}
