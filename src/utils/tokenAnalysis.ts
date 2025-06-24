export interface Position {
  line: number;
  column: number;
  index: number;
  sourceURL?: string | null;
}

export interface Token {
  type: string;
  value: string;
  start: Position;
  end: Position;
}

export const opLike = /^(\|>|==?=?|!==?|<=?|>=?|[-+*/%]=?)$/;

export interface AnalysisResult {
  stats: Map<string, number>;
  problems: {
    line: number;
    col: number;
    val: string;
    msg: string;
  }[];
}

export function analyseTokens(tokens: Token[]): AnalysisResult {
  const stats = new Map<string, number>();
  const problems: AnalysisResult['problems'] = [];
  const stack: string[] = [];
  const pushProb = (tok: Token, msg: string) => {
    problems.push({ line: tok.start.line, col: tok.start.column + 1, val: tok.value, msg });
  };

  for (const t of tokens) {
    stats.set(t.type, (stats.get(t.type) || 0) + 1);
    if (t.type === 'ERROR_TOKEN' || t.type.startsWith('INVALID')) pushProb(t, 'lexer error token');
    if (t.type === 'IDENTIFIER' && opLike.test(t.value)) pushProb(t, 'identifier looks like operator');

    if (t.type === 'PUNCTUATION') {
      if ('{(['.includes(t.value)) stack.push(t.value);
      if ('}])'.includes(t.value)) {
        const o = stack.pop();
        if (!o || '({['.indexOf(o) !== ')}]'.indexOf(t.value)) pushProb(t, 'unbalanced bracket');
      }
    }
  }
  if (stack.length) pushProb(tokens[tokens.length - 1], 'unclosed bracket');
  return { stats, problems };
}

export function unicodeBad(tokens: Token[]): Token[] {
  return tokens.filter(t => t.type === 'IDENTIFIER' && /[\uD800-\uDFFF]/.test(t.value));
}

export function maxDepth(tokens: Token[]): number {
  let d = 0, max = 0;
  for (const t of tokens) {
    if ('([{'.includes(t.value)) d++;
    if (')]}'.includes(t.value)) d--;
    max = Math.max(max, d);
  }
  return max;
}

export function lineMap(tokens: Token[]): Map<number, Token[]> {
  const m = new Map<number, Token[]>();
  tokens.forEach(t => m.set(t.start.line, [...(m.get(t.start.line) || []), t]));
  return m;
}
