// src/lexer/PipelineOperatorReader.js

import { createLiteralReader } from './readerFactory.js';

// “|>” must be contiguous – no whitespace is permitted inside the token.
export const PipelineOperatorReader = createLiteralReader(
  'PIPELINE_OPERATOR',
  '|>'
);
