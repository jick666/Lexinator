#!/usr/bin/env node
import { CharStream } from "./lexer/CharStream.js";
import { LexerEngine } from "./lexer/LexerEngine.js";
import { IncrementalLexer } from "./integration/IncrementalLexer.js";
import { BufferedIncrementalLexer } from "./integration/BufferedIncrementalLexer.js";
import { createTokenStream, TokenStream } from "./integration/TokenStream.js";
import { collectTokens } from "./integration/tokenUtils.js";
import { fileURLToPath } from "url";
import { registerPlugin, clearPlugins } from "./pluginManager.js";

/**
 *
 * @param code
 * @param root0
 * @param root0.verbose
 */
export function tokenize(
  code,
  { verbose = false, errorRecovery = false, sourceURL = null } = {}
) {
  const stream = new CharStream(code, { sourceURL });
  const lexer = new LexerEngine(stream, { errorRecovery });
  return collectTokens(lexer, tok => {
    if (verbose) console.log(tok);
  });
}

export { IncrementalLexer, BufferedIncrementalLexer, TokenStream, createTokenStream };
export { registerPlugin, clearPlugins };

// Only run CLI when invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = process.argv[2] || "";
  const verbose = process.argv.includes("--verbose");
  try {
    console.log(tokenize(input, { verbose }));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
