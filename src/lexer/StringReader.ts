import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { LexerError } from './LexerError.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function StringReader(
  stream: CharStream,
  factory: TokenFactory
): Token | LexerError | null {
  const quote = stream.current();
  if (quote !== '"' && quote !== "'") return null;

  const start = stream.getPosition();
  const buf: string[] = [quote];
  stream.advance();

  while (!stream.eof()) {
    const ch = stream.current() as string;

    if (ch === '\\') {
      buf.push(ch);
      stream.advance();
      if (stream.eof()) {
        return new LexerError(
          'BadEscape',
          'Bad escape sequence',
          start,
          stream.getPosition(),
          stream.input
        );
      }
      buf.push(stream.current() as string);
      stream.advance();
      continue;
    }
    if (ch === quote) {
      buf.push(quote);
      stream.advance();
      return factory('STRING', buf.join(''), start, stream.getPosition());
    }
    if (ch === '\n' || ch === '\r') {
      return new LexerError(
        'UnterminatedString',
        'Unterminated string literal',
        start,
        stream.getPosition(),
        stream.input
      );
    }
    buf.push(ch);
    stream.advance();
  }
  return new LexerError(
    'UnterminatedString',
    'Unterminated string literal',
    start,
    stream.getPosition(),
    stream.input
  );
}
