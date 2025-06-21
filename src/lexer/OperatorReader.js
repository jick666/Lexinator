// §4.3 OperatorReader
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

const ops = JavaScriptGrammar.sortedOperators;

export function OperatorReader(stream, factory) {
  const startPos = stream.getPosition();
  for (const op of ops) {
    if (stream.input.startsWith(op, stream.index)) {
      // consume without creating intermediate substrings
      for (let i = 0; i < op.length; i++) stream.advance();
      const endPos = stream.getPosition();
      return factory('OPERATOR', op, startPos, endPos);
    }
  }
  return null;
}
