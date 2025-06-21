export function RecordAndTupleReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '#') return null;
  const next = stream.peek();
  if (next !== '{' && next !== '[') return null;
  // consume '#'
  stream.advance();
  // consume '{' or '['
  stream.advance();
  const endPos = stream.getPosition();
  const type = next === '{' ? 'RECORD_START' : 'TUPLE_START';
  const value = next === '{' ? '#{' : '#[';
  return factory(type, value, startPos, endPos);
}
