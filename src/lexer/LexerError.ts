import type { Position } from './Token.js';

export class LexerError extends Error {
  type: string;
  start: Position;
  end: Position;
  input: string | null;

  constructor(
    type: string,
    message: string,
    start: Position,
    end: Position,
    input: string | null = null
  ) {
    super(message);
    this.name = 'LexerError';
    this.type = type;
    this.start = start;
    this.end = end;
    this.input = input;
  }

  get location(): string {
    return `line ${this.start.line}, column ${this.start.column}`;
  }

  get context(): string {
    if (!this.input) return '';
    const line = this.input.split(/\r?\n/)[this.start.line - 1] || '';
    const caret = ' '.repeat(this.start.column) + '^';
    return `${line}\n${caret}`;
  }

  toString(): string {
    const ctx = this.context ? `\n${this.context}` : '';
    return `LexerError[${this.type}] ${this.message} at ${this.location}${ctx}`;
  }

  toJSON(): { type: string; message: string; start: Position; end: Position } {
    return { type: this.type, message: this.message, start: this.start, end: this.end };
  }
}

