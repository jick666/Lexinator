export const opLike = /^(\|>|==?=?|!==?|<=?|>=?|[-+*/%]=?)$/;

export function analyseTokens(tokens) {
  const stats = new Map();
  const problems = [];
  const stack = [];
  const pushProb = (tok, msg) => {
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

export function unicodeBad(tokens) {
  return tokens.filter(t => t.type === 'IDENTIFIER' && /[\uD800-\uDFFF]/.test(t.value));
}

export function maxDepth(tokens) {
  let d = 0, max = 0;
  for (const t of tokens) {
    if ('([{'.includes(t.value)) d++;
    if (')]}'.includes(t.value)) d--;
    max = Math.max(max, d);
  }
  return max;
}

export function lineMap(tokens) {
  const m = new Map();
  tokens.forEach(t => m.set(t.start.line, [...(m.get(t.start.line) || []), t]));
  return m;
}
