export function BindOperatorReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() === ':' && stream.peek() === ':') {
    stream.advance();
    stream.advance();
    const endPos = stream.getPosition();
    return factory('BIND_OPERATOR', '::', startPos, endPos);
  }
  return null;
}
