export function createLexerCollector(LexerClass, opts = {}) {
  const types = [];
  const lexer = new LexerClass({ ...opts, onToken: t => types.push(t.type) });
  return { lexer, types };
}

export function getTokenTypes(lexer) {
  return lexer.getTokens().map(t => t.type);
}
