export function PrivateIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '#') return null;
  stream.advance();
  let ch = stream.current();
  if (ch === null || !(/[A-Za-z_]/.test(ch))) {
    stream.setPosition(startPos);
    return null;
  }
  let value = '#';
  value += ch;
  stream.advance();
  ch = stream.current();
  while (ch !== null && /[A-Za-z0-9_]/.test(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  return factory('PRIVATE_IDENTIFIER', value, startPos, endPos);
}
