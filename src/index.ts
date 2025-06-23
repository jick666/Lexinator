#!/usr/bin/env node
import { CharStream } from './lexer/CharStream.js';
import { LexerEngine } from './lexer/LexerEngine.js';
import { IncrementalLexer } from './integration/IncrementalLexer.js';
import { BufferedIncrementalLexer } from './integration/BufferedIncrementalLexer.js';
import { createTokenStream, TokenStream } from './integration/TokenStream.js';
import { tokenIterator } from './integration/tokenUtils.js';
import { fileURLToPath } from 'url';
import { registerPlugin, clearPlugins } from './pluginManager.js';
import type { Token } from './lexer/Token.js';

export interface TokenizeOptions {
  verbose?: boolean;
  errorRecovery?: boolean;
  sourceURL?: string | null;
}

export function tokenize(
  code: string,
  { verbose = false, errorRecovery = false, sourceURL = null }: TokenizeOptions = {}
): Token[] {
  const stream = new CharStream(code, { sourceURL });
  const lexer = new LexerEngine(stream, { errorRecovery });
  const tokens: Token[] = [];
  for (const tok of tokenIterator(lexer)) {
    tokens.push(tok as Token);
    if (verbose) console.log(tok);
  }
  return tokens;
}

export { IncrementalLexer, BufferedIncrementalLexer, TokenStream, createTokenStream };
export { registerPlugin, clearPlugins };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = process.argv[2] || '';
  const verbose = process.argv.includes('--verbose');
  try {
    console.log(tokenize(input, { verbose }));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
