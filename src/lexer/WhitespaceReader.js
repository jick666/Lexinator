// src/lexer/WhitespaceReader.js          (rewritten ✨)
import { createWhitespaceReader } from './utils.js';

const WS = new Set([' ', '\n', '\t', '\r', '\v', '\f']);

export const WhitespaceReader = createWhitespaceReader(ch => WS.has(ch));
