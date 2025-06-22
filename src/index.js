#!/usr/bin/env node
import { CharStream } from "./lexer/CharStream.js";
import { LexerEngine } from "./lexer/LexerEngine.js";
import { IncrementalLexer } from "./integration/IncrementalLexer.js";
import { BufferedIncrementalLexer } from "./integration/BufferedIncrementalLexer.js";
import { createTokenStream, TokenStream } from "./integration/TokenStream.js";
import { tokenIterator } from "./integration/tokenUtils.js";
import { fileURLToPath } from "url";
import {
  registerPlugin,
  clearPlugins,
  PluginManager,
  globalPluginManager
} from "./pluginManager.js";

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
  const tokens = [];
  for (const tok of tokenIterator(lexer)) {
    tokens.push(tok);
    if (verbose) console.log(tok);
  }
  return tokens;
}

export { IncrementalLexer, BufferedIncrementalLexer, TokenStream, createTokenStream };
export { registerPlugin, clearPlugins, PluginManager, globalPluginManager };

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
