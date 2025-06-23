// src/lexer/TokenReader.js
export type ReaderFn = (
  stream: unknown,
  factory: unknown,
  engine?: unknown
) => unknown;

/**
 * Reader contract v2 – readers are now *functions* only.
 *
 * Signature:
 *   reader(stream, factory, engine?) → Token | LexerError | null
 *
 * This helper simply validates the contract and invokes the reader.  The
 * former conditional branch for “.read() objects” has been removed to keep
 * the inner lexer loop hot-path lean.
 */

export function runReader(
  reader: ReaderFn,
  stream: unknown,
  factory: unknown,
  engine?: unknown
): unknown {
  if (typeof reader !== 'function') {
    throw new TypeError(
      `Reader must be a function, received ${typeof reader}`
    );
  }
  return reader(stream, factory, engine);
}
