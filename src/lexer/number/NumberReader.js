// §4.2 NumberReader
import { readNumberLiteral, isDigit } from '../utils.js';

export function NumberReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!isDigit(stream.current())) return null;

  const result = readNumberLiteral(stream, startPos);
  if (!result) return null;
  const { value } = result;
  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
