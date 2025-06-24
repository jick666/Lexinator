import { createLiteralReader } from './readerFactory.js';

export const FunctionSentReader = createLiteralReader(
  'FUNCTION_SENT',
  'function.sent',
  { checkPrev: true, checkNext: true }
);
