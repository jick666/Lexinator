export function ShebangReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.index !== 0) return null;
  if (stream.current() !== '#' || stream.peek() !== '!') return null;

  let value = '';
  while (!stream.eof() && stream.current() !== '\n') {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('COMMENT', value, startPos, endPos);
}
