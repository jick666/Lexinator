import { consumeKeyword } from './utils.js';

export function UsingStatementReader(stream, factory) {
  const startPos = stream.getPosition();

  // await using
  const saved = stream.getPosition();
  let endPos = consumeKeyword(stream, 'await');
  if (endPos) {
    let value = 'await';
    if (!/\s/.test(stream.current())) {
      stream.setPosition(saved);
    } else {
      while (!stream.eof() && /\s/.test(stream.current())) {
        value += stream.current();
        stream.advance();
      }
      const usingEnd = consumeKeyword(stream, 'using', { checkPrev: false });
      if (usingEnd) {
        value += 'using';
        return factory('AWAIT_USING', value, startPos, usingEnd);
      }
      stream.setPosition(saved);
    }
  }

  endPos = consumeKeyword(stream, 'using');
  if (endPos) {
    return factory('USING', 'using', startPos, endPos);
  }

  return null;
}
