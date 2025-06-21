import { consumeKeyword } from './utils.js';

export function ImportCallReader(stream, factory) {
  const startPos = stream.getPosition();
  const endPos = consumeKeyword(stream, 'import');
  if (!endPos) return null;

  // confirm '(' but don't consume
  if (stream.current() !== '(') {
    stream.setPosition(startPos);
    return null;
  }

  return factory('IMPORT_CALL', 'import', startPos, endPos);
}
