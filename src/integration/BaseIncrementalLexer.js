import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { Token } from '../lexer/Token.js';
import { saveState, restoreState } from './stateUtils.js';

/**
 * BaseIncrementalLexer provides shared setup and state utilities for
 * incremental lexer implementations. Subclasses are expected to
 * implement the `feed()` method to consume input and emit tokens.
 */
export class BaseIncrementalLexer {
  constructor({ onToken, errorRecovery = false, sourceURL = null } = {}) {
    this.onToken = onToken || (() => {});
    this.tokens = [];
    this.stream = new CharStream('', { sourceURL });
    this.engine = new LexerEngine(this.stream, { errorRecovery });
    // dependencies for state helpers
    this._deps = { CharStream, LexerEngine, Token };
  }

  /**
   * Push a token to the internal list and notify the callback.
   * @param {Token} token Token to emit
   */
  emit(token) {
    this.tokens.push(token);
    this.onToken(token);
  }

  /**
   * Return all tokens produced so far.
   */
  getTokens() {
    return this.tokens.slice();
  }

  /**
   * Serialize the lexer's internal state for persistence.
   * @param {boolean} includeTrivia When true, also persists trivia tokens.
   */
  saveState(includeTrivia = false) {
    return saveState(this, includeTrivia);
  }

  /**
   * Restore a previously saved lexer state.
   * @param {object} state
   * @param {boolean} includeTrivia When true, also restores trivia tokens.
   */
  restoreState(state, includeTrivia = false) {
    restoreState(this, state, includeTrivia);
  }

  // eslint-disable-next-line class-methods-use-this
  feed() {
    throw new Error('feed() must be implemented by subclass');
  }
}
