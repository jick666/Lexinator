import { createRadixReader } from './RadixReader.js';

/**
 * §4.4 OctalReader
 * Parses octal integer literals like 0o777 or 0O123.
 */
export const OctalReader = createRadixReader(
  ['o', 'O'],
  (ch: string | null): boolean => ch !== null && ch >= '0' && ch <= '7'
);
