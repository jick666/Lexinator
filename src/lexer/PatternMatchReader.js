import { consumeKeyword } from './utils.js';

export function PatternMatchReader(stream, factory) {
  const startPos = stream.getPosition();

  let endPos = consumeKeyword(stream, 'match');
  if (endPos) {
    return factory('MATCH', 'match', startPos, endPos);
  }

  endPos = consumeKeyword(stream, 'case');
  if (endPos) {
    return factory('CASE', 'case', startPos, endPos);
  }

  return null;
}
