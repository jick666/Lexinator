/**
 * §8.1 Fuzz Testing
 * @description Placeholder for future fuzz tests to ensure reader resilience.
 * Agents can use random or malformed inputs here.
 */

import { CharStream } from "../src/lexer/CharStream.js";
import { IdentifierReader } from "../src/lexer/IdentifierReader.js";
import { NumberReader } from "../src/lexer/NumberReader.js";
import { OperatorReader } from "../src/lexer/OperatorReader.js";
import { PunctuationReader } from "../src/lexer/PunctuationReader.js";
import { RegexOrDivideReader } from "../src/lexer/RegexOrDivideReader.js";
import { TemplateStringReader } from "../src/lexer/TemplateStringReader.js";
import { WhitespaceReader } from "../src/lexer/WhitespaceReader.js";
import { BinaryReader } from "../src/lexer/BinaryReader.js";
import { OctalReader } from "../src/lexer/OctalReader.js";
import { ExponentReader } from "../src/lexer/ExponentReader.js";
import { NumericSeparatorReader } from "../src/lexer/NumericSeparatorReader.js";
import { UnicodeIdentifierReader } from "../src/lexer/UnicodeIdentifierReader.js";
import { UnicodeEscapeIdentifierReader } from "../src/lexer/UnicodeEscapeIdentifierReader.js";
import { ShebangReader } from "../src/lexer/ShebangReader.js";

function randomAsciiString(maxLen = 20) {
  const len = Math.floor(Math.random() * (maxLen + 1));
  let out = "";
  for (let i = 0; i < len; i++) {
    const code = 32 + Math.floor(Math.random() * 95); // printable ASCII
    out += String.fromCharCode(code);
  }
  return out;
}

// generate a pool of random inputs once so each test uses the same set
const FUZZ_INPUTS = Array.from({ length: 50 }, () => randomAsciiString());
const READERS = [
  ["IdentifierReader", IdentifierReader],
  ["NumberReader", NumberReader],
  ["OperatorReader", OperatorReader],
  ["PunctuationReader", PunctuationReader],
  ["RegexOrDivideReader", RegexOrDivideReader],
  ["TemplateStringReader", TemplateStringReader],
  ["WhitespaceReader", WhitespaceReader],
  ["BinaryReader", BinaryReader],
  ["OctalReader", OctalReader],
  ["ExponentReader", ExponentReader],
  ["NumericSeparatorReader", NumericSeparatorReader],
  ["UnicodeIdentifierReader", UnicodeIdentifierReader],
  ["UnicodeEscapeIdentifierReader", UnicodeEscapeIdentifierReader],
  ["ShebangReader", ShebangReader],
];

READERS.forEach(([name, reader]) => {
  describe(`${name} fuzz`, () => {
    test.each(FUZZ_INPUTS)(
      `%s handles random input without throwing`,
      (input) => {
        const stream = new CharStream(input);
        expect(() => reader(stream, () => {})).not.toThrow();
      },
    );
  });
});
