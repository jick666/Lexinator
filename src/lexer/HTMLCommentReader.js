// src/lexer/HTMLCommentReader.js

export function HTMLCommentReader(stream, factory) {
  const start = stream.getPosition();
  const prev = start.index > 0 ? stream.input[start.index - 1] : null;
  if (prev && prev !== '\n') return null;

  /* <!-- … */
  if (stream.current() === '<' && stream.peek() === '!' &&
      stream.peek(2) === '-' && stream.peek(3) === '-') {
    const buf = ['<', '!', '-', '-'];
    stream.advance(); stream.advance(); stream.advance(); stream.advance();
    while (!stream.eof() && stream.current() !== '\n') { buf.push(stream.current()); stream.advance(); }
    return factory('COMMENT', buf.join(''), start, stream.getPosition());
  }

  /* --> … */
  if (stream.current() === '-' && stream.peek() === '-' && stream.peek(2) === '>') {
    const buf = ['-', '-', '>'];
    stream.advance(); stream.advance(); stream.advance();
    while (!stream.eof() && stream.current() !== '\n') { buf.push(stream.current()); stream.advance(); }
    return factory('COMMENT', buf.join(''), start, stream.getPosition());
  }
  return null;
}
