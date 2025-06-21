// §4.4 PunctuationReader
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

export function PunctuationReader(stream, factory) {
  const startPos = stream.getPosition();
  const ch = stream.current();
  if (JavaScriptGrammar.punctuationSet.has(ch)) {
    stream.advance();
    const endPos = stream.getPosition();
    return factory('PUNCTUATION', ch, startPos, endPos);
  }
  return null;
}
