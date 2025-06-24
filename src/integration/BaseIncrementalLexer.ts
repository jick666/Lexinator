import type { CharStream } from '../lexer/CharStream.js';
import type { LexerEngine } from '../lexer/LexerEngine.js';
import type { Token } from '../lexer/Token.js';
import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { Token as TokenCtor } from '../lexer/Token.js';
import { saveState, restoreState } from './stateUtils.js';

/**
 * BaseIncrementalLexer provides shared setup and state utilities for
 * incremental lexer implementations. Subclasses are expected to
 * implement the `feed()` method to consume input and emit tokens.
 */
export interface BaseLexerOptions {
  onToken?: (t: Token) => void;
  errorRecovery?: boolean;
  sourceURL?: string | null;
  createToken?: (type: string, val: any, s: any, e: any, src?: string | null) => Token;
}

export class BaseIncrementalLexer {
  onToken: (t: Token) => void;
  tokens: Token[];
  stream: CharStream;
  engine: LexerEngine;
  _deps: { CharStream: typeof CharStream; LexerEngine: typeof LexerEngine; Token: typeof TokenCtor };

  constructor({ onToken, errorRecovery = false, sourceURL = null, createToken }: BaseLexerOptions = {}) {
    this.onToken = onToken || (() => {});
    this.tokens = [];
    this.stream = new CharStream('', { sourceURL });
    this.engine = new LexerEngine(this.stream, { errorRecovery, createToken });
    // dependencies for state helpers
    this._deps = { CharStream, LexerEngine, Token: TokenCtor };
  }

  /**
   * Push a token to the internal list and notify the callback.
   * @param {Token} token Token to emit
   */
  emit(token: Token): void {
    this.tokens.push(token);
    this.onToken(token);
  }

  /**
   * Return all tokens produced so far.
   */
  getTokens(): Token[] {
    return this.tokens.slice();
  }

  /**
   * Serialize the lexer's internal state for persistence.
   * @param {boolean} includeTrivia When true, also persists trivia tokens.
   */
  saveState(includeTrivia = false): any {
    return saveState(this, includeTrivia);
  }

  /**
   * Restore a previously saved lexer state.
   * @param {object} state
   * @param {boolean} includeTrivia When true, also restores trivia tokens.
   */
  restoreState(state: any, includeTrivia = false): void {
    restoreState(this, state, includeTrivia);
  }

  // eslint-disable-next-line class-methods-use-this
  feed(): void {
    throw new Error('feed() must be implemented by subclass');
  }
}
