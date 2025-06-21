// src/integration/BufferedIncrementalLexer.js

import { BaseIncrementalLexer } from './BaseIncrementalLexer.js';
import { LexerError } from '../lexer/LexerError.js';

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

      // Trivia handling with lazy allocation.
      if (token.type === 'WHITESPACE') {
        this.trivia.push(token);
        continue;
      }

      if (this.trivia.length) token.attachLeading(this.trivia);
      if (this.tokens.length && this.trivia.length) {
        this.tokens[this.tokens.length - 1].attachTrailing(this.trivia);
      }
      this.trivia = [];

      this.tokens.push(token);
      this.onToken(token);
    }
  }

  saveState() {
    return super.saveState(true);
  }

  restoreState(state) {
    super.restoreState(state, true);
  }
}
