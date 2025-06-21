// src/lexer/StringReader.js

import { LexerError } from './LexerError.js';

export function StringReader(stream, factory) {
  const quote = stream.current();
  if (quote !== '"' && quote !== "'") return null;

  const start = stream.getPosition();
  const buf   = [quote];
  stream.advance();

  while (!stream.eof()) {
    const ch = stream.current();

    if (ch === '\\') {                      // escape
      buf.push(ch); stream.advance();
      if (stream.eof()) {
        return new LexerError('BadEscape','Bad escape sequence',start,stream.getPosition(),stream.input);
      }
      buf.push(stream.current()); stream.advance(); continue;
    }
    if (ch === quote) {                    // end
      buf.push(quote); stream.advance();
      return factory('STRING', buf.join(''), start, stream.getPosition());
    }
    if (ch === '\n' || ch === '\r') {
      return new LexerError('UnterminatedString','Unterminated string literal',start,stream.getPosition(),stream.input);
    }
    buf.push(ch); stream.advance();
  }
  return new LexerError('UnterminatedString','Unterminated string literal',start,stream.getPosition(),stream.input);
}
