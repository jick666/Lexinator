import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function SourceMappingURLReader(
  stream: CharStream,
  factory: TokenFactory
): Token | null {
  const start = stream.getPosition();
  const patterns = [
    '//# sourceMappingURL=',
    '//@ sourceMappingURL=',
    '/*# sourceMappingURL=',
    '/*@ sourceMappingURL=',
  ];

  for (const p of patterns) if (stream.input.startsWith(p, stream.index)) {
    const isBlock = p.startsWith('/*');
    for (let i = 0; i < p.length; i++) stream.advance();
    const buf: string[] = [];
    if (isBlock) {
      while (
        !stream.eof() &&
        !(stream.current() === '*' && stream.peek() === '/')
      ) {
        buf.push(stream.current() as string);
        stream.advance();
      }
      if (stream.current() === '*' && stream.peek() === '/') {
        stream.advance();
        stream.advance();
      }
    } else {
      while (!stream.eof() && stream.current() !== '\n') {
        buf.push(stream.current() as string);
        stream.advance();
      }
    }
    return factory('SOURCE_MAPPING_URL', buf.join('').trim(), start, stream.getPosition());
  }
  return null;
}
