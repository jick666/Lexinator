// @ts-nocheck
import { test, expect } from '@jest/globals';
import { CharStream } from "../../src/lexer/CharStream.js";
import { BindOperatorReader } from "../../src/lexer/BindOperatorReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("BindOperatorReader reads :: operator", () => {
  const { token } = runReader(BindOperatorReader, "::");
  expect(token.type).toBe("BIND_OPERATOR");
  expect(token.value).toBe("::");
});

test("BindOperatorReader returns null when sequence not matched", () => {
  const stream = new CharStream("?:");
  const pos = stream.getPosition();
  const { token } = runReader(BindOperatorReader, undefined, undefined, stream);
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
