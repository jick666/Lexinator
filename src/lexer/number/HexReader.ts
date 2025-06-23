import { createRadixReader, isHexDigit } from './RadixReader.js';

/**
 * §4.4 HexReader
 * Parses hexadecimal integer literals like 0xFF.
 */
export const HexReader = createRadixReader(
  ['x', 'X'],
  isHexDigit
);
