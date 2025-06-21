// src/lexer/WhitespaceReader.js          (rewritten ✨)
const WS = new Set([' ','\n','\t','\r','\v','\f']);

export function WhitespaceReader(stream, factory) {
  const start = stream.getPosition();
  if (!WS.has(stream.current())) return null;

  const buf = [];
  while (!stream.eof() && WS.has(stream.current())) { buf.push(stream.current()); stream.advance(); }
  return factory('WHITESPACE', buf.join(''), start, stream.getPosition());
}
