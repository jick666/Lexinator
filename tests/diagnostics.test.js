import { jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';
import { runCliModule } from './utils/cliTestUtils.js';

const runDiagnostics = (args = [], env = {}, stdinTTY = true, exitFn) =>
  runCliModule('src/utils/diagnostics.js', { args, env, stdinTTY, exitFn }).then(r => r.logs);

test('diagnostics CLI prints token details', async () => {
  const logs = await runDiagnostics(['let x=1;']);
  expect(logs.some(l => l.includes('KEYWORD(let)'))).toBe(true);
});

test('diagnostics CLI outputs JSON when requested', async () => {
  const logs = await runDiagnostics(['let x=1;'], { JSON: '1' });
  const tokens = JSON.parse(logs[0]);
  expect(tokens[0].type).toBe('KEYWORD');
});
// Additional diagnostics coverage

test('diagnostics CLI shows help and exits', () => {
  const diagPath = fileURLToPath(new URL('../src/utils/diagnostics.js', import.meta.url));
  const { stdout, status } = spawnSync(process.execPath, [diagPath, '--help'], { encoding: 'utf8' });
  expect(status).toBe(0);
  expect(stdout).toContain('usage: diagnostics.js');
});

test('diagnostics CLI help path via import', async () => {
  const exitSpy = jest.fn();
  const logs = await runDiagnostics(['--help'], {}, true, exitSpy);
  expect(exitSpy).toHaveBeenCalledWith(0);
  expect(logs.join('')).toContain('usage: diagnostics.js');
});

test('diagnostics CLI prints debug indices', async () => {
  const logs = await runDiagnostics(['--debug', 'let x=1;']);
  expect(logs[0].startsWith('0')).toBe(true);
});

test('diagnostics CLI shows trivia output', async () => {
  const logs = await runDiagnostics(['--trivia', '  x;']);
  expect(logs.some(l => l.includes('lead→'))).toBe(true);
});

test('diagnostics CLI reads from stdin when not TTY', async () => {
  jest.spyOn(fs, 'readFileSync').mockReturnValue('let y=2;\n');
  const logs = await runDiagnostics([], {}, false);
  fs.readFileSync.mockRestore();
  expect(logs.some(l => l.includes('IDENTIFIER(y)'))).toBe(true);
});

test('diagnostics CLI repl mode processes input', async () => {
  const events = {};
  jest.spyOn(readline, 'createInterface').mockReturnValue({
    setPrompt: jest.fn(),
    prompt: jest.fn(),
    on: (ev, cb) => { events[ev] = cb; }
  });
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  const logs = await runDiagnostics(['--repl']);
  events.line('let z=3;');
  events.close();
  expect(logs.some(l => l.includes('KEYWORD(let)'))).toBe(true);
  expect(exitSpy).toHaveBeenCalled();
  readline.createInterface.mockRestore();
  exitSpy.mockRestore();
});

test('diagnostics CLI reports potential issues', async () => {
  const logs = await runDiagnostics(['(']);
  expect(logs.some(l => l.includes('potential issues'))).toBe(true);
});

test('diagnostics CLI logs mode transitions', async () => {
  const logs = await runDiagnostics(['do { 1 }']);
  expect(logs.some(l => l.includes('mode transitions'))).toBe(true);
});

test('diagnostics CLI reports malformed unicode identifiers', async () => {
  jest.unstable_mockModule('../src/index.js', () => ({
    tokenize: () => [{
      type: 'IDENTIFIER',
      value: '\uD800',
      start: { line: 1, column: 0 },
      end: { line: 1, column: 1 }
    }]
  }));
  const { logs } = await runCliModule('src/utils/diagnostics.js', { args: ['dummy'] });
  expect(logs.some(l => l.includes('malformed unicode identifiers'))).toBe(true);
});
