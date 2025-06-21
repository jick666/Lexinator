export function FunctionSentReader(stream, factory) {
  const startPos = stream.getPosition();
  const prevIndex = startPos.index - 1;
  const prevChar = prevIndex >= 0 ? stream.input[prevIndex] : null;
  if (prevChar && /[A-Za-z0-9_$]/.test(prevChar)) return null;

  const seq = 'function.sent';
  if (!stream.input.startsWith(seq, startPos.index)) return null;

  const saved = stream.getPosition();
  for (const ch of seq) {
    if (stream.current() !== ch) {
      stream.setPosition(saved);
      return null;
    }
    stream.advance();
  }

  const next = stream.current();
  if (next && /[A-Za-z0-9_$]/.test(next)) {
    stream.setPosition(saved);
    return null;
  }

  const endPos = stream.getPosition();
  return factory('FUNCTION_SENT', seq, startPos, endPos);
}
