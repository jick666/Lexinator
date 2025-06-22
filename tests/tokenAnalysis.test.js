import { tokenize } from '../src/index.js';
import { analyseTokens, unicodeBad, maxDepth, lineMap } from '../src/utils/tokenAnalysis.js';

test('analyseTokens computes statistics and finds no problems for valid code', () => {
  const tokens = tokenize('let x=1;');
  const { stats, problems } = analyseTokens(tokens);
  expect(stats.get('KEYWORD')).toBe(1);
  expect(problems.length).toBe(0);
});

test('unicodeBad detects invalid identifier characters', () => {
  const invalid = [{ type: 'IDENTIFIER', value: '\uD800', start: { line: 1, column: 0 }, end: { line: 1, column: 1 } }];
  expect(unicodeBad(invalid).length).toBe(1);
});

test('maxDepth calculates bracket depth', () => {
  const tokens = tokenize('(1+(2))');
  expect(maxDepth(tokens)).toBe(2);
});

test('lineMap groups tokens by line', () => {
  const tokens = tokenize('let x=1;\nlet y=2;');
  const map = lineMap(tokens);
  expect(map.get(1).length).toBeGreaterThan(0);
  expect(map.get(2).length).toBeGreaterThan(0);
});
