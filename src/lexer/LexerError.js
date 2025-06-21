export class LexerError extends Error {
  constructor(type, message, start, end, input = null) {
    super(message);
    this.name = 'LexerError';
    this.type = type;
    this.start = start;
    this.end = end;
    this.input = input;
  }

  get location() {
    return `line ${this.start.line}, column ${this.start.column}`;
  }

  get context() {
    if (!this.input) return '';
    const line = this.input.split(/\r?\n/)[this.start.line - 1] || '';
    const caret = ' '.repeat(this.start.column) + '^';
    return `${line}\n${caret}`;
  }

  toString() {
    const ctx = this.context ? `\n${this.context}` : '';
    return `LexerError[${this.type}] ${this.message} at ${this.location}${ctx}`;
  }

  toJSON() {
    return { type: this.type, message: this.message, start: this.start, end: this.end };
  }
}

