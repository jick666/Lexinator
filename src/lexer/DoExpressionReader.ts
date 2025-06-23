import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

export function DoExpressionReader(
  stream: CharStream,
  factory: TokenFactory,
  engine?: any
): Token | null {
  const startPos = stream.getPosition();
  if (engine && engine.currentMode && engine.currentMode() === 'do_block') {
    if (stream.current() === '{') {
      engine.doBlockDepth = (engine.doBlockDepth || 0) + 1;
      return null; // regular brace within do block
    }
    if (stream.current() === '}') {
      if (engine.doBlockDepth > 0) {
        engine.doBlockDepth--;
        return null;
      }
      stream.advance();
      const endPos = stream.getPosition();
      engine.popMode();
      return factory('DO_BLOCK_END', '}', startPos, endPos);
    }
  }

  if (stream.current() !== 'd' || stream.peek() !== 'o') return null;
  const savedPos = stream.getPosition();
  stream.advance();
  stream.advance();
  let ch = stream.current() as string | null;
  while (ch && /\s/.test(ch)) {
    stream.advance();
    ch = stream.current() as string | null;
  }
  if (ch === '{') {
    stream.advance();
    engine && engine.pushMode && engine.pushMode('do_block');
    engine.doBlockDepth = 0;
    const endPos = stream.getPosition();
    return factory('DO_BLOCK_START', 'do {', startPos, endPos);
  }
  stream.setPosition(savedPos);
  return null;
}
