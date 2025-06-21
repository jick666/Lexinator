// src/lexer/SourceMappingURLReader.js

export function SourceMappingURLReader(stream, factory) {
  const start = stream.getPosition();
  const patterns = ['//# sourceMappingURL=','//@ sourceMappingURL=','/*# sourceMappingURL=','/*@ sourceMappingURL='];

  for (const p of patterns) if (stream.input.startsWith(p, stream.index)) {
    const isBlock = p.startsWith('/*');
    for (let i = 0; i < p.length; i++) stream.advance();        // consume prefix
    const buf = [];
    if (isBlock) {
      while (!stream.eof() && !(stream.current() === '*' && stream.peek() === '/')) { buf.push(stream.current()); stream.advance(); }
      if (stream.current() === '*' && stream.peek() === '/') { stream.advance(); stream.advance(); }
    } else {
      while (!stream.eof() && stream.current() !== '\n') { buf.push(stream.current()); stream.advance(); }
    }
    return factory('SOURCE_MAPPING_URL', buf.join('').trim(), start, stream.getPosition());
  }
  return null;
}
