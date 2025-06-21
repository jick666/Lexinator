import { createRadixReader } from './RadixReader.js';

/**
 * §4.4 BinaryReader
 * Parses binary integer literals like 0b1010 or 0B0101.
 */
export const BinaryReader = createRadixReader(
  ['b', 'B'],
  ch => ch === '0' || ch === '1'
);

