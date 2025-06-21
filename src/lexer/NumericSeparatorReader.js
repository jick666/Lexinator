import { readDigitsWithUnderscores, isDigit } from './utils.js';

export function NumericSeparatorReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDigit(ch)) return null;

  const result = readDigitsWithUnderscores(stream, startPos);
  if (!result) return null;
  const { value, underscoreSeen, lastUnderscore } = result;

  if (!underscoreSeen || lastUnderscore) {
    stream.setPosition(startPos);
    return null;
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
