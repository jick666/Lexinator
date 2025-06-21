export function PatternMatchReader(stream, factory) {
  const startPos = stream.getPosition();
  const prevIndex = startPos.index - 1;
  const prevChar = prevIndex >= 0 ? stream.input[prevIndex] : null;
  if (prevChar && /[A-Za-z0-9_$]/.test(prevChar)) return null;

  if (stream.input.startsWith('match', stream.index)) {
    const saved = stream.getPosition();
    for (const ch of 'match') {
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
    return factory('MATCH', 'match', startPos, endPos);
  }

  if (stream.input.startsWith('case', stream.index)) {
    const saved = stream.getPosition();
    for (const ch of 'case') {
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
    return factory('CASE', 'case', startPos, endPos);
  }

  return null;
}
