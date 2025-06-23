import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function ImportAssertionReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const start = stream.getPosition();
  if (!stream.input.startsWith('assert', stream.index)) return null;

  const buf: string[] = [];
  for (const c of 'assert') {
    if (stream.current() !== c) {
      stream.setPosition(start);
      return null;
    }
    buf.push(c);
    stream.advance();
  }

  const next = stream.current();
  if (next !== ':' && next !== '{' && !/\s/.test(next as string)) {
    stream.setPosition(start);
    return null;
  }

  while (/\s/.test((stream.current() || '') as string)) {
    buf.push(stream.current() as string);
    stream.advance();
  }

  if (stream.current() === ':') {
    buf.push(':');
    stream.advance();
    while (/\s/.test((stream.current() || '') as string)) {
      buf.push(stream.current() as string);
      stream.advance();
    }
  }

  if (stream.current() !== '{') {
    stream.setPosition(start);
    return null;
  }

  buf.push('{');
  stream.advance();
  let depth = 1,
    inStr: string | null = null;
  while (!stream.eof() && depth) {
    const ch = stream.current() as string;
    buf.push(ch);
    stream.advance();

    if (inStr) {
      if (ch === '\\') {
        if (!stream.eof()) {
          buf.push(stream.current() as string);
          stream.advance();
        }
        continue;
      }
      if (ch === inStr) {
        inStr = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
  }
  if (depth) {
    stream.setPosition(start);
    return null;
  }
  return factory('IMPORT_ASSERTION', buf.join(''), start, stream.getPosition());
}
