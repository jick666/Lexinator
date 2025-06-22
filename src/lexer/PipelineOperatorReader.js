// src/lexer/PipelineOperatorReader.js

export function PipelineOperatorReader(stream, factory) {
  const startPos = stream.getPosition();

  // “|>” must be contiguous – no whitespace is permitted inside the token.
  if (stream.current() === '|' && stream.peek() === '>') {
    stream.advance(); // '|'
    stream.advance(); // '>'
    const endPos = stream.getPosition();
    return factory('PIPELINE_OPERATOR', '|>', startPos, endPos);
  }
  return null;
}
