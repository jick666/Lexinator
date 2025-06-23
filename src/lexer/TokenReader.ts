import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export type Reader = (
  stream: CharStream,
  factory: TokenFactory,
  engine?: any
) => Token | null;

export function runReader(
  reader: Reader,
  stream: CharStream,
  factory: TokenFactory,
  engine?: any
): Token | null {
  if (typeof reader !== 'function') {
    throw new TypeError(
      `Reader must be a function, received ${typeof reader}`
    );
  }
  return reader(stream, factory, engine);
}
