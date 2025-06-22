// src/integration/BufferedIncrementalLexer.js

import { BaseIncrementalLexer } from './BaseIncrementalLexer.js';
import { bufferedTokenIterator } from './tokenUtils.js';

export class BufferedIncrementalLexer extends BaseIncrementalLexer {
  constructor(options = {}) {
    super(options);
    this.trivia = [];
  }

  feed(chunk) {
    this.stream.append(chunk);
    for (const token of bufferedTokenIterator(this.engine, this.stream, this.trivia)) {
      this.emit(token);
    }
  }

  saveState() {
    return super.saveState(true);
  }

  restoreState(state) {
    super.restoreState(state, true);
  }
}
