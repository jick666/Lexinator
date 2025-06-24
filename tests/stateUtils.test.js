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

test('stateInput none requires input on restore', () => {
  const stream = new CharStream('xyz');
  const engine = new LexerEngine(stream);
  engine.stateInput = 'none';
  const instance = { stream, engine, tokens: [], trivia: [], _deps: { CharStream, LexerEngine, Token } };
  const state = saveState(instance);

  const restored = { _deps: { CharStream, LexerEngine, Token } };
  expect(() => restoreState(restored, state)).toThrow('no source text');

  restoreState(restored, state, false, { input: 'xyz' });
  expect(restored.stream.input).toBe('xyz');
});
