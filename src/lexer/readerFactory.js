export function createLiteralReader(
  tokenType,
  literal,
  {
    requireStart = false,
    checkPrev = false,
    checkNext = false
  } = {}
) {
  const chars = [...literal];
  return function literalReader(stream, factory) {
    const start = stream.getPosition();
    if (requireStart && stream.index !== 0) return null;

    if (checkPrev) {
      const prevIdx = start.index - 1;
      const prev = prevIdx >= 0 ? stream.input[prevIdx] : null;
      if (prev && /[A-Za-z0-9_$]/.test(prev)) return null;
    }

    for (const ch of chars) {
      if (stream.current() !== ch) {
        stream.setPosition(start);
        return null;
      }
      stream.advance();
    }

    if (checkNext && /[A-Za-z0-9_$]/.test(stream.current() || '')) {
      stream.setPosition(start);
      return null;
    }

    const end = stream.getPosition();
    return factory(tokenType, literal, start, end);
  };
}
