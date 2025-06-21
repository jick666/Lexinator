import { readNumberLiteral, isDigit } from './utils.js';

export function DecimalLiteralReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();

  // prefix form 0d123.45
  if (ch === '0' && (stream.peek() === 'd' || stream.peek() === 'D')) {
    // ensure digits after prefix
    const firstDigit = stream.peek(2);
    if (!isDigit(firstDigit)) return null;

    let value = '0' + stream.peek();
    stream.advance(); // 0
    stream.advance(); // d or D
    const result = readNumberLiteral(stream, startPos, true);
    if (!result) return null;
    value += result.value;
    const endPos = stream.getPosition();
    return factory('DECIMAL', value, startPos, endPos);
  }

  // suffix form 123.45m or 123m
  if (isDigit(ch)) {
    const result = readNumberLiteral(stream, startPos, true);
    if (result) {
      let { value, ch: next } = result;
      if (next === 'm' || next === 'M') {
        value += next;
        stream.advance();
        const endPos = stream.getPosition();
        return factory('DECIMAL', value, startPos, endPos);
      }
    } else {
      return null;
    }
  }

  // not a decimal literal
  stream.setPosition(startPos);
  return null;
}
