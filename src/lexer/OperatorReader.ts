import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

const ops = JavaScriptGrammar.sortedOperators;

export function OperatorReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const startPos = stream.getPosition();
  for (const op of ops) {
    if (stream.input.startsWith(op, stream.index)) {
      for (let i = 0; i < op.length; i++) stream.advance();
      const endPos = stream.getPosition();
      return factory('OPERATOR', op, startPos, endPos);
    }
  }
  return null;
}
