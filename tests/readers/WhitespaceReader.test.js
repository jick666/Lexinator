import { WhitespaceReader } from "../../src/lexer/WhitespaceReader.js";
import { runReader } from "../utils/readerTestUtils.js";

test("WhitespaceReader reads consecutive spaces", () => {
  const { token, stream } = runReader(WhitespaceReader, "   abc");
  expect(token.type).toBe("WHITESPACE");
  expect(token.value).toBe("   ");
  expect(stream.getPosition().index).toBe(3);
  expect(stream.current()).toBe("a");
});

test("WhitespaceReader handles mixed whitespace characters", () => {
  const { token, stream } = runReader(WhitespaceReader, " \t\n\r\v\fabc");
  expect(token.type).toBe("WHITESPACE");
  expect(token.value).toBe(" \t\n\r\v\f");
  expect(stream.getPosition().index).toBe(6);
  expect(stream.current()).toBe("a");
});
