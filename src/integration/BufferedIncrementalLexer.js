// src/integration/BufferedIncrementalLexer.js

import { BaseIncrementalLexer } from './BaseIncrementalLexer.js';
import { LexerError } from '../lexer/LexerError.js';
import { processToken } from './tokenUtils.js';

function isIncompleteBlockComment(token, stream) {
  return (
    token.type === 'COMMENT' &&
    token.value.startsWith('/*') &&
    !token.value.endsWith('*/') &&
    stream.eof()
  );
}

export class BufferedIncrementalLexer extends BaseIncrementalLexer {
  constructor(options = {}) {
    super(options);
    this.trivia = [];
  }

  feed(chunk) {
    this.stream.append(chunk);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pos = this.stream.getPosition();
      let token = null;

      try {
        token = this.engine.nextToken();
      } catch (err) {
        if (err instanceof LexerError && err.end.index >= this.stream.input.length) {
          // Incomplete token at end of input – rewind and wait for more data.
          this.stream.setPosition(pos);
          break;
        }
        throw err;
      }

      if (token === null) break;

      // Handle incomplete multi-line comments specially.
      if (isIncompleteBlockComment(token, this.stream)) {
        this.stream.setPosition(pos);
        break;
      }

      const prev = this.tokens.length ? this.tokens[this.tokens.length - 1] : null;
      const out = processToken(token, this.trivia, prev);
      if (!out) continue;
      this.emit(out);
    }
  }

  saveState() {
    return super.saveState(true);
  }

  restoreState(state) {
    super.restoreState(state, true);
  }
}
