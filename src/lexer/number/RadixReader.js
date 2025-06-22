// ─── src/lexer/RadixReader.js ────────────────────────────────────────────────
export const isHexDigit = ch =>
  ch !== null && (
    (ch >= '0' && ch <= '9') ||
    (ch >= 'a' && ch <= 'f') ||
    (ch >= 'A' && ch <= 'F')
  );

export const createRadixReader = (prefixes, isOk) => (stream, factory) => {
  const start = stream.getPosition();

  /* 0x / 0b / 0o prefix -----------------------------------------------------*/
  if (stream.current() !== '0') return null;
  const p = stream.peek();
  if (!prefixes.includes(p)) return null;
  const nxt = stream.peek(2);
  if (nxt === null || !isOk(nxt)) return null;

  const buf = ['0', p];
  stream.advance();               // 0
  stream.advance();               // x | b | o

  /* now copy digits while they are valid _and_ we’re not at EOF */
  while (stream.current() !== null && isOk(stream.current())) {
    buf.push(stream.current());
    stream.advance();
  }

  return factory('NUMBER', buf.join(''), start, stream.getPosition());
};
