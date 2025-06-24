// src/integration/tokenUtils.js

export function* tokenIterator(engine) {
  let trivia = [];
  let prev   = null;

  while (true) {
    const tok = engine.nextToken();
    if (tok === null) {
      if (prev && trivia.length) prev.attachTrailing(trivia);
      return;
    }

    if (tok.type === 'WHITESPACE') {
      trivia.push(tok);
      continue;
    }

    if (trivia.length) tok.attachLeading(trivia);
    if (prev && trivia.length) prev.attachTrailing(trivia);

    trivia = [];
    prev   = tok;
    yield tok;
  }
}

export function collectTokens(engine, onToken) {
  const tokens = [];
  for (const tok of tokenIterator(engine)) {
    tokens.push(tok);
    if (onToken) onToken(tok);
  }
  return tokens;
}
