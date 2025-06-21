import { consumeKeyword } from './utils.js';

export function ImportMetaReader(stream, factory) {
  const startPos = stream.getPosition();
  const endPos = consumeKeyword(stream, 'import.meta', { checkPrev: false });
  if (!endPos) return null;
  return factory('IMPORT_META', 'import.meta', startPos, endPos);
}
