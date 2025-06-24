// src/lexer/UnicodeWhitespaceReader.js

import { createWhitespaceReader } from './utils.js';

const WS_RE = /\p{White_Space}/u;

export const UnicodeWhitespaceReader = createWhitespaceReader(ch => WS_RE.test(ch || ''));
