import { readNumericWithUnderscores, isDigit } from './utils.js';

export function BigIntReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!isDigit(stream.current())) return null;

  const result = readNumericWithUnderscores(stream, startPos, { suffix: 'n' });
  if (!result) return null;

  const { value, endPos } = result;
  return factory('BIGINT', value, startPos, endPos);
}
