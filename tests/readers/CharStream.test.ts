import { CharStream } from "../../src/lexer/CharStream.js";

test("CharStream advance updates line and column across newlines", () => {
  const stream = new CharStream("a\nb\n");
  // start position before any advance
  expect(stream.getPosition()).toEqual({ line: 1, column: 0, index: 0, sourceURL: null });

  // advance over 'a'
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 1, column: 1, index: 1, sourceURL: null });

  // advance over '\n' should increment line and reset column
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 2, column: 0, index: 2, sourceURL: null });

  // advance over 'b'
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 2, column: 1, index: 3, sourceURL: null });

  // advance over final '\n'
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 3, column: 0, index: 4, sourceURL: null });
});

test("CharStream setPosition restores previous position", () => {
  const stream = new CharStream("abc");
  stream.advance();
  stream.advance();
  const pos = stream.getPosition();
  stream.advance();
  expect(stream.getPosition().index).toBe(3);
  stream.setPosition(pos);
  expect(stream.getPosition()).toEqual(pos);
});

test("CharStream current/peek/eof handling at bounds", () => {
  const stream = new CharStream("ab");
  // initial position
  expect(stream.current()).toBe("a");
  expect(stream.peek()).toBe("b");
  expect(stream.eof()).toBe(false);

  stream.advance();
  expect(stream.current()).toBe("b");
  expect(stream.peek()).toBeNull();
  expect(stream.eof()).toBe(false);

  stream.advance();
  expect(stream.current()).toBeNull();
  expect(stream.peek()).toBeNull();
  expect(stream.eof()).toBe(true);
});

test("CharStream handles CRLF newlines", () => {
  const stream = new CharStream("a\r\nb");
  stream.advance(); // 'a'
  expect(stream.getPosition()).toEqual({ line: 1, column: 1, index: 1, sourceURL: null });
  stream.advance(); // '\r'
  expect(stream.getPosition()).toEqual({ line: 1, column: 2, index: 2, sourceURL: null });
  stream.advance(); // '\n'
  expect(stream.getPosition()).toEqual({ line: 2, column: 0, index: 3, sourceURL: null });
  stream.advance(); // 'b'
  expect(stream.getPosition()).toEqual({ line: 2, column: 1, index: 4, sourceURL: null });
});
