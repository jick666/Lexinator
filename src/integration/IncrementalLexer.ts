import { BaseIncrementalLexer, BaseLexerOptions } from './BaseIncrementalLexer.js';
import { tokenIterator } from './tokenUtils.js';

/**
 * IncrementalLexer allows feeding code chunks and emits tokens as they are produced.
 */
export class IncrementalLexer extends BaseIncrementalLexer {
  constructor(options: BaseLexerOptions = {}) {
    super(options);
  }

  /**
   * Feed additional source text to the lexer.
   * @param {string} chunk
   */
  feed(chunk: string): void {
    this.stream.append(chunk);
    for (const token of tokenIterator(this.engine)) {
      this.emit(token);
    }
  }

}
