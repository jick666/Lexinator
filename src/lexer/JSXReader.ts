import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import { LexerError } from './LexerError.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function JSXReader(
  stream: CharStream,
  factory: TokenFactory,
  engine?: any
): Token | LexerError | null {
  if (stream.current() !== '<') return null;
  const start = stream.getPosition();
  const buf: string[] = [];
  let depth = 0,
    brace = 0,
    quote: string | null = null;

  while (!stream.eof()) {
    const ch = stream.current() as string;
    buf.push(ch);

    if (quote) {
      if (ch === '\\') {
        stream.advance();
        if (!stream.eof()) {
          buf.push(stream.current() as string);
          stream.advance();
        }
        continue;
      }
      if (ch === quote) quote = null;
      stream.advance();
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      stream.advance();
      continue;
    }
    if (ch === '{') {
      brace++;
      stream.advance();
      continue;
    }
    if (ch === '}') {
      if (brace) brace--;
      stream.advance();
      continue;
    }

    if (!brace) {
      if (ch === '<') {
        depth++;
        stream.advance();
        continue;
      }
      if (ch === '/' && stream.peek() === '>') {
        buf.push('>');
        stream.advance();
        stream.advance();
        depth--;
        if (depth <= 0) {
          engine?.popMode?.();
          return factory('JSX_TEXT', buf.join(''), start, stream.getPosition());
        }
        continue;
      }
      if (ch === '>') {
        depth--;
        stream.advance();
        if (depth <= 0) {
          engine?.popMode?.();
          return factory('JSX_TEXT', buf.join(''), start, stream.getPosition());
        }
        continue;
      }
    }
    stream.advance();
  }
  return new LexerError(
    'UnterminatedJSX',
    'Unterminated JSX element',
    start,
    stream.getPosition(),
    stream.input
  );
}
