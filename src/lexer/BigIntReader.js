import { readDigitsWithUnderscores, finalizeUnderscoredDigits, isDigit } from './utils.js';

export function BigIntReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDigit(ch)) return null;

  // verify there is a trailing 'n' so this is really a bigint
  let idx = stream.index;
  while (idx < stream.input.length && /[0-9_]/.test(stream.input[idx])) {
    idx++;
  }
  if (stream.input[idx] !== 'n') return null;

  const result = readDigitsWithUnderscores(stream, startPos);
  if (!result) return null;
  let value = finalizeUnderscoredDigits(stream, startPos, result);
  if (value === null) return null;
  ch = stream.current();

  if (ch !== 'n') {
    stream.setPosition(startPos);
    return null;
  }

  value += 'n';
  stream.advance();
  const endPos = stream.getPosition();
  return factory('BIGINT', value, startPos, endPos);
}
