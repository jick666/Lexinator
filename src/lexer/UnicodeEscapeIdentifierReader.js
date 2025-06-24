// src/lexer/UnicodeEscapeIdentifierReader.js

import { makeIdentifierReader } from './utils.js';

export const UnicodeEscapeIdentifierReader = makeIdentifierReader({ unicode: true, allowEscape: true });
