import { CharStream } from "../../src/lexer/CharStream.js";
import { FunctionSentReader } from "../../src/lexer/FunctionSentReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test("FunctionSentReader reads function.sent", () => {
  expectToken(FunctionSentReader, "function.sent", "FUNCTION_SENT", "function.sent", 13);
});

test("FunctionSentReader returns null when sequence not matched", () => {
  expectNull(FunctionSentReader, "function.send");
});

test("FunctionSentReader returns null inside identifier", () => {
  const stream = new CharStream("myfunction.sent");
  stream.advance();
  stream.advance();
  expectNull(FunctionSentReader, stream);
});

test("FunctionSentReader requires word boundary", () => {
  expectNull(FunctionSentReader, "function.sentx");
});
