import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';
import type { LexerEngine } from './LexerEngine.js';
import type { LexerError } from './LexerError.js';

export type Reader = (
  stream: CharStream,
  factory: TokenFactory,
  engine?: LexerEngine
) => Token | LexerError | null;

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function runReader(
  reader: Reader,
  stream: CharStream,
  factory: TokenFactory,
  engine?: LexerEngine
): Token | LexerError | null {
  if (typeof reader !== 'function') {
    throw new TypeError(`Reader must be a function, received ${typeof reader}`);
  }
  return reader(stream, factory, engine);
}
