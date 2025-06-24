// src/lexer/UnicodeIdentifierReader.js

import { makeIdentifierReader } from './utils.js';

export const UnicodeIdentifierReader = makeIdentifierReader({ unicode: true, bailASCII: true });
