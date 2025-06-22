// src/integration/tokenUtils.js
import { LexerError } from '../lexer/LexerError.js';

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

function isIncompleteBlockComment(token, stream) {
  return (
    token.type === 'COMMENT' &&
    token.value.startsWith('/*') &&
    !token.value.endsWith('*/') &&
    stream.eof()
  );
}

export function* bufferedTokenIterator(engine, stream, trivia = []) {
  let prev = null;

  while (true) {
    const pos = stream.getPosition();
    let tok = null;
    try {
      tok = engine.nextToken();
    } catch (err) {
      if (err instanceof LexerError && err.end.index >= stream.input.length) {
        stream.setPosition(pos);
        if (prev && trivia.length) prev.attachTrailing(trivia);
        return;
      }
      throw err;
    }

    if (tok === null) {
      if (prev && trivia.length) prev.attachTrailing(trivia);
      return;
    }

    if (isIncompleteBlockComment(tok, stream)) {
      stream.setPosition(pos);
      if (prev && trivia.length) prev.attachTrailing(trivia);
      return;
    }

    if (tok.type === 'WHITESPACE') {
      trivia.push(tok);
      continue;
    }

    if (trivia.length) tok.attachLeading(trivia);
    if (prev && trivia.length) prev.attachTrailing(trivia);

    trivia.length = 0;
    prev = tok;
    yield tok;
  }
}
