import { CharStream } from '../../src/lexer/CharStream.js';
import { LexerEngine } from '../../src/lexer/LexerEngine.js';

export function createEngine(source, options) {
  return new LexerEngine(new CharStream(source), options);
}
