import { Readable } from 'stream';
import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { tokenIterator } from './tokenUtils.js';

export class TokenStream extends Readable {
  /**
   * @param {string} code Source code to tokenize
   * @param {object} options
   * @param {typeof CharStream} [options.CharStream]
   * @param {typeof LexerEngine} [options.LexerEngine]
   * @param {Function} [options.iteratorFn]
   * @param {boolean} [options.errorRecovery]
   */
  constructor(
    code,
    {
      CharStream: CharStreamClass = CharStream,
      LexerEngine: LexerEngineClass = LexerEngine,
      iteratorFn = tokenIterator,
      errorRecovery = false
    } = {}
  ) {
    super({ objectMode: true });
    this.stream = new CharStreamClass(code);
    this.engine = new LexerEngineClass(this.stream, { errorRecovery });
    this.iter = iteratorFn(this.engine);
  }

  _read() {
    const { value, done } = this.iter.next();
    if (done) {
      this.push(null);
      return;
    }
    this.push(value);
  }
}

/**
 * Create a Readable stream that emits tokens for syntax highlighting.
 * @param {string} code Source code to tokenize
 * @returns {Readable}
 */
export function createTokenStream(code, options) {
  return new TokenStream(code, options);
}
