import { readNumericWithUnderscores, isDigit } from './utils.js';

export function NumericSeparatorReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!isDigit(stream.current())) return null;

  const result = readNumericWithUnderscores(stream, startPos, { requireUnderscore: true });
  if (!result) return null;

  const { value, endPos } = result;
  return factory('NUMBER', value, startPos, endPos);
}
