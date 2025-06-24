import { CharStream } from "../../src/lexer/CharStream.js";
import { UsingStatementReader } from "../../src/lexer/UsingStatementReader.js";
import { expectToken, expectNull } from "../utils/readerTestUtils.js";

test.each([
  ["using x", "USING", "using", 5],
  ["await using x", "AWAIT_USING", "await using", 11]
])("UsingStatementReader reads %s", (src, type, value, index) => {
  expectToken(UsingStatementReader, src, type, value, index);
});

test("UsingStatementReader returns null inside identifier", () => {
  const stream = new CharStream("abusing");
  stream.advance();
  stream.advance();
  expectNull(UsingStatementReader, stream);
});

test('UsingStatementReader fails for "await" not followed by whitespace', () => {
  const { stream } = expectNull(UsingStatementReader, 'await;');
  expect(stream.getPosition().index).toBe(0);
});

test('UsingStatementReader resets when await not followed by using', () => {
  const { stream } = expectNull(UsingStatementReader, 'await foo');
  expect(stream.getPosition().index).toBe(0);
});
