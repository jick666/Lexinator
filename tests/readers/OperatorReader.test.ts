// @ts-nocheck
import { test, expect } from '@jest/globals';
import { CharStream } from "../../src/lexer/CharStream.js";
import { OperatorReader } from "../../src/lexer/OperatorReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("OperatorReader reads single and multi-char", () => {
  const { token } = runReader(OperatorReader, undefined, undefined, new CharStream("== => + -"));
  expect(token.value).toBe("==");
});

test("OperatorReader reads new ECMAScript operators", () => {
  const stream = new CharStream("?. ?? ??= ** **= &&= ||=");
  const expected = ["?.", "??", "??=", "**", "**=", "&&=", "||="];
  expected.forEach(value => {
    const { token } = runReader(OperatorReader, undefined, undefined, stream);
    expect(token.value).toBe(value);
    stream.advance();
  });
});
