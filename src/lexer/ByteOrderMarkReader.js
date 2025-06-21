export function ByteOrderMarkReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.index !== 0) return null;
  if (stream.current() !== '\uFEFF') return null;
  stream.advance();
  const endPos = stream.getPosition();
  return factory('BOM', '\uFEFF', startPos, endPos);
}
