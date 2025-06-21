import { createRadixReader } from './RadixReader.js';

export const OctalReader = createRadixReader(
  ['o', 'O'],
  ch => ch >= '0' && ch <= '7'
);

