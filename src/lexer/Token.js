// src/lexer/Token.js
export class Token {
  constructor(type, value, start, end, sourceURL = start.sourceURL ?? null) {
    this.type  = type;
    this.value = value;
    this.start = start;
    this.end   = end;
    this.range = [start.index, end.index];
    this.sourceURL = sourceURL;
    this.leadingTrivia  = null;
    this.trailingTrivia = null;
  }

  attachLeading(t)  { if (t?.length) this.leadingTrivia  = t; }
  attachTrailing(t) { if (t?.length) this.trailingTrivia = t; }

  toJSON() {
    const plain = p => (typeof p?.toJSON === 'function')
      ? p.toJSON()
      : { line: p.line, column: p.column, index: p.index, sourceURL: p.sourceURL ?? null };

    const obj = {
      type:  this.type,
      value: this.value,
      start: plain(this.start),
      end:   plain(this.end),
      range: this.range
    };
    if (this.sourceURL)      obj.sourceURL      = this.sourceURL;
    if (this.leadingTrivia)  obj.leadingTrivia  = this.leadingTrivia.map(t => t.toJSON());
    if (this.trailingTrivia) obj.trailingTrivia = this.trailingTrivia.map(t => t.toJSON());
    return obj;
  }
}
