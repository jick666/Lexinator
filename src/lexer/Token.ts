export interface Position {
  line: number;
  column: number;
  index: number;
  sourceURL: string | null;
  toJSON?: () => {
    line: number;
    column: number;
    index: number;
    sourceURL: string | null;
  };
}

export interface Trivia {
  toJSON(): any;
}

export class Token {
  type: string;
  value: any;
  start: Position;
  end: Position;
  range: [number, number];
  sourceURL: string | null;
  leadingTrivia: Trivia[] | null;
  trailingTrivia: Trivia[] | null;

  constructor(
    type: string,
    value: any,
    start: Position,
    end: Position,
    sourceURL: string | null = start.sourceURL ?? null
  ) {
    this.type = type;
    this.value = value;
    this.start = start;
    this.end = end;
    this.range = [start.index, end.index];
    this.sourceURL = sourceURL;
    this.leadingTrivia = null;
    this.trailingTrivia = null;
  }

  attachLeading(t?: Trivia[] | null): void { if (t?.length) this.leadingTrivia = t; }
  attachTrailing(t?: Trivia[] | null): void { if (t?.length) this.trailingTrivia = t; }

  toJSON(): any {
    const plain = (p: Position): any => typeof (p as any)?.toJSON === 'function'
      ? (p as any).toJSON()
      : { line: p.line, column: p.column, index: p.index, sourceURL: p.sourceURL ?? null };

    const obj: any = {
      type: this.type,
      value: this.value,
      start: plain(this.start),
      end: plain(this.end),
      range: this.range
    };
    if (this.sourceURL) obj.sourceURL = this.sourceURL;
    if (this.leadingTrivia) obj.leadingTrivia = this.leadingTrivia.map(t => t.toJSON());
    if (this.trailingTrivia) obj.trailingTrivia = this.trailingTrivia.map(t => t.toJSON());
    return obj;
  }
}
