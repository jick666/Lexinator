import { IdentifierReader } from './IdentifierReader.js';
import { NumberReader } from './NumberReader.js';
import { OperatorReader } from './OperatorReader.js';
import { PunctuationReader } from './PunctuationReader.js';
import { RegexOrDivideReader } from './RegexOrDivideReader.js';
import { TemplateStringReader } from './TemplateStringReader.js';
import { WhitespaceReader } from './WhitespaceReader.js';
import { Token } from './Token.js';
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

/**
 * LexerEngine orchestrates all token readers to produce a stream of Tokens.
 */
export class LexerEngine {
  constructor(stream) {
    this.stream = stream;
    this.stateStack = ['default'];
    // Mapping of mode -> reader list. Order determines priority.
    this.modes = {
      default: [
        IdentifierReader,
        NumberReader,
        OperatorReader,
        PunctuationReader,
        RegexOrDivideReader,
        TemplateStringReader
      ],
      template_string: [TemplateStringReader],
      regex: [RegexOrDivideReader]
    };
    // Track last returned token for contextual readers
    this.lastToken = null;
  }

  currentMode() {
    return this.stateStack[this.stateStack.length - 1];
  }

  pushMode(mode) {
    this.stateStack.push(mode);
  }

  popMode() {
    if (this.stateStack.length > 1) {
      this.stateStack.pop();
    }
  }

  /**
   * Reads the next token from the stream, or returns null at EOF.
   */
  nextToken() {
    const { stream } = this;
    const factory = (type, value, start, end) => new Token(type, value, start, end);

    while (!stream.eof()) {
      // 1. Skip whitespace (and collect as trivia internally, if desired)
      WhitespaceReader(stream, factory, this);
      if (stream.eof()) break;

      const mode = this.currentMode();
      const readers = this.modes[mode] || this.modes.default;

      // 2. Try each reader in sequence for the current mode
      for (const Reader of readers) {
        const token = Reader(stream, factory, this);
        if (token) {
          // 3. Promote identifiers that match keywords
          if (
            token.type === 'IDENTIFIER' &&
            JavaScriptGrammar.keywordSet.has(token.value)
          ) {
            token.type = 'KEYWORD';
          }
          this.lastToken = token;
          return token;
        }
      }

      // 4. If nothing matched, advance one character to avoid infinite loops
      stream.advance();
    }

    // End of file
    return null;
  }
}
