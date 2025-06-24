import { createLiteralReader } from './readerFactory.js';

export const ByteOrderMarkReader = createLiteralReader(
  'BOM',
  '\uFEFF',
  { requireStart: true }
);
