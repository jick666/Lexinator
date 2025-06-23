// src/integration/BufferedIncrementalLexer.js

import { BaseIncrementalLexer, BaseLexerOptions } from './BaseIncrementalLexer.js';
import { LexerError } from '../lexer/LexerError.js';
import type { Token } from '../lexer/Token.js';

function isIncompleteBlockComment(token, stream) {
  return (
    token.type === 'COMMENT' &&
    token.value.startsWith('/*') &&
    !token.value.endsWith('*/') &&
    stream.eof()
  );
}

export class BufferedIncrementalLexer extends BaseIncrementalLexer {
  trivia: Token[];

  constructor(options: BaseLexerOptions = {}) {
    super(options);
    this.trivia = [];
  }

  feed(chunk: string): void {
    this.stream.append(chunk);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pos = this.stream.getPosition();
      let token: Token | null = null;

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

      this.emit(token);
    }
  }

  saveState(): any {
    return super.saveState(true);
  }

  restoreState(state: any): void {
    super.restoreState(state, true);
  }
}
