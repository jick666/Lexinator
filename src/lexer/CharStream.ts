// src/lexer/CharStream.ts
import type { Position } from './Token.js';

const NL = '\n';

function bsearch(arr: number[], idx: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] > idx) hi = mid - 1;
    else                lo = mid + 1;
  }
  return lo - 1;
}

export class CharStream {
  input: string;
  length: number;
  index: number;
  sourceURL: string | null;
  baseOffset: number;
  baseLine: number;
  baseColumn: number;
  lineStarts: number[];

  constructor(
    input: string,
    { sourceURL = null, baseOffset = 0, baseLine = 1, baseColumn = 0 } = {}
  ) {
    this.input      = input;
    this.length     = input.length;
    this.index      = 0;

    this.sourceURL  = sourceURL ?? null;
    this.baseOffset = baseOffset | 0;
    this.baseLine   = baseLine   | 0;
    this.baseColumn = baseColumn | 0;

    this.lineStarts = [0];
    for (let i = 0; i < this.length; i++) {
      if (input[i] === NL) this.lineStarts.push(i + 1);
    }

    Object.defineProperties(this, {
      line:   { get: () => this.getPosition().line   },
      column: { get: () => this.getPosition().column }
    });
  }

  append(chunk: string): void {
    const base = this.length;
    this.input += chunk;
    this.length = this.input.length;
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === NL) this.lineStarts.push(base + i + 1);
    }
  }

  current(): string | null { return this.index < this.length ? this.input[this.index] ?? null : null; }
  peek(o = 1): string | null { const p = this.index + o; return p < this.length ? this.input[p] ?? null : null; }
  advance(): void { this.index++; }
  eof(): boolean { return this.index >= this.length; }

  getPosition(): Position {
    const localIdx  = this.index;
    const liIdx     = bsearch(this.lineStarts, localIdx);

    const globalIdx   = this.baseOffset + localIdx;
    const globalLine  = this.baseLine   + liIdx;
    const localCol    = localIdx - this.lineStarts[liIdx];
    const globalCol   = liIdx === 0 ? this.baseColumn + localCol : localCol;

    const pos: Position = {
      line:      globalLine,
      column:    globalCol,
      index:     globalIdx,
      sourceURL: this.sourceURL
    };
    Object.defineProperty(pos, 'toJSON', {
      enumerable: false,
      value: () => ({
        line: pos.line,
        column: pos.column,
        index: pos.index,
        sourceURL: pos.sourceURL
      })
    });
    return pos;
  }

  setPosition(p: number | { index: number }): void {
    const gIdx = typeof p === 'number' ? p : p.index;
    this.index = gIdx - this.baseOffset;
  }
}
