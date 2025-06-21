export function TSDecoratorReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== '@') return null;
  let value = '@';
  stream.advance();
  while (stream.current() && /[A-Za-z0-9_$]/.test(stream.current())) {
    value += stream.current();
    stream.advance();
  }
  return factory('DECORATOR', value, start, stream.getPosition());
}
