import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { collectTokens } from '../src/integration/tokenUtils.js';

test('collectTokens gathers tokens from engine', () => {
  const stream = new CharStream('let a = 1;');
  const engine = new LexerEngine(stream);
  const tokens = collectTokens(engine);
  expect(tokens.length).toBeGreaterThan(0);
  expect(tokens[0].value).toBe('let');
});

