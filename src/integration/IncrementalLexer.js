import { BaseIncrementalLexer } from './BaseIncrementalLexer.js';
import { tokenIterator } from './tokenUtils.js';

/**
 * IncrementalLexer allows feeding code chunks and emits tokens as they are produced.
 */
export class IncrementalLexer extends BaseIncrementalLexer {
  constructor(options = {}) {
    super(options);
  }

  /**
   * Feed additional source text to the lexer.
   * @param {string} chunk
   */
  feed(chunk) {
    this.stream.append(chunk);
    for (const token of tokenIterator(this.engine)) {
      this.emit(token);
    }
  }

}
