import { saveState, restoreState } from '../src/integration/stateUtils.js';
import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { Token } from '../src/lexer/Token.js';

test('saveState with full policy stores input', () => {
  const stream = new CharStream('abc');
  const engine = new LexerEngine(stream);
  const instance = { stream, engine, tokens: [], trivia: [], _deps: { CharStream, LexerEngine, Token } };
  const state = saveState(instance);
  expect(state.input).toBe('abc');
});

test('tail policy stores tail and restores correctly', () => {
  const stream = new CharStream('hello');
  stream.setPosition(2);
  const engine = new LexerEngine(stream);
  engine.stateInput = 'tail';
  const instance = { stream, engine, tokens: [], trivia: [], _deps: { CharStream, LexerEngine, Token } };
  const state = saveState(instance);
  expect(state.inputTail).toBe('llo');

  const restored = { _deps: { CharStream, LexerEngine, Token } };
  restoreState(restored, state);
  expect(restored.stream.input).toBe('llo');
});

test('none policy throws if input not supplied on restore', () => {
  const stream = new CharStream('foo');
  const engine = new LexerEngine(stream);
  engine.stateInput = 'none';
  const instance = { stream, engine, tokens: [], trivia: [], _deps: { CharStream, LexerEngine, Token } };
  const state = saveState(instance);
  expect(state.input).toBeUndefined();
  const target = { _deps: { CharStream, LexerEngine, Token } };
  expect(() => restoreState(target, state)).toThrow('restoreState: no source text available');
});

test('none policy restores when input provided', () => {
  const stream = new CharStream('bar');
  const engine = new LexerEngine(stream);
  engine.stateInput = 'none';
  const instance = { stream, engine, tokens: [], trivia: [], _deps: { CharStream, LexerEngine, Token } };
  const state = saveState(instance);
  const restored = { _deps: { CharStream, LexerEngine, Token } };
  restoreState(restored, state, false, { input: 'bar' });
  expect(restored.stream.input).toBe('bar');
});
