// src/integration/tokenUtils.js

export function processToken(token, trivia, prev) {
  if (token.type === 'WHITESPACE') {
    trivia.push(token);
    return null;
  }

  if (trivia.length) token.attachLeading([...trivia]);
  if (prev && trivia.length) prev.attachTrailing([...trivia]);

  trivia.length = 0;
  return token;
}

export function* tokenIterator(engine) {
  const trivia = [];
  let prev = null;

  while (true) {
    const tok = engine.nextToken();
    if (tok === null) {
      if (prev && trivia.length) prev.attachTrailing(trivia);
      return;
    }

    const out = processToken(tok, trivia, prev);
    if (!out) continue;

    prev = out;
    yield out;
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
