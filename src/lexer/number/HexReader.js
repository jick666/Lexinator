import { createRadixReader, isHexDigit } from './RadixReader.js';

export const HexReader = createRadixReader(
  ['x', 'X'],
  isHexDigit
);

