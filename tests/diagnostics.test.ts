// @ts-nocheck
import { jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

async function runDiagnostics(args = [], env = {}, stdinTTY = true, exitFn) {
  jest.resetModules();
  const diagPath = fileURLToPath(new URL('../src/utils/diagnostics.js', import.meta.url));
  const originalArgv = process.argv.slice();
  const originalEnv = { ...process.env };
  const origTTY = process.stdin.isTTY;
  const origExit = process.exit;
  process.argv = [process.execPath, diagPath, ...args];
  Object.assign(process.env, env);
  process.stdin.isTTY = stdinTTY;
  if (exitFn) process.exit = exitFn;

  const logs = [];
  const originalLog = console.log;
  console.log = (msg) => logs.push(msg);

  await import('../src/utils/diagnostics.js');

  console.log = originalLog;
  process.argv = originalArgv;
  process.env = originalEnv;
  process.stdin.isTTY = origTTY;
  if (exitFn) process.exit = origExit;
  return logs;
}

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
  const diagPath = fileURLToPath(new URL('../src/utils/diagnostics.js', import.meta.url));
  jest.unstable_mockModule('../src/index.js', () => ({
    tokenize: () => [{
      type: 'IDENTIFIER',
      value: '\uD800',
      start: { line: 1, column: 0 },
      end: { line: 1, column: 1 }
    }]
  }));
  jest.resetModules();
  const logs = [];
  const originalLog = console.log;
  console.log = (msg) => logs.push(msg);
  const origArgv = process.argv.slice();
  process.argv = [process.execPath, diagPath, 'dummy'];
  await import('../src/utils/diagnostics.js');
  console.log = originalLog;
  process.argv = origArgv;
  expect(logs.some(l => l.includes('malformed unicode identifiers'))).toBe(true);
});

test('diagnostics CLI colourises error and operator-like identifiers', async () => {
  const diagPath = fileURLToPath(new URL('../src/utils/diagnostics.js', import.meta.url));
  jest.unstable_mockModule('../src/index.js', () => ({
    tokenize: () => [
      {
        type: 'PUNCTUATION',
        value: ';',
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 }
      },
      {
        type: 'ERROR_TOKEN',
        value: '?',
        start: { line: 1, column: 1 },
        end: { line: 1, column: 2 }
      },
      {
        type: 'IDENTIFIER',
        value: '==',
        start: { line: 1, column: 2 },
        end: { line: 1, column: 4 }
      }
    ]
  }));
  jest.resetModules();
  const logs = [];
  const originalLog = console.log;
  console.log = (msg) => logs.push(msg);
  const origArgv = process.argv.slice();
  process.argv = [process.execPath, diagPath, 'dummy'];
  await import('../src/utils/diagnostics.js');
  console.log = originalLog;
  process.argv = origArgv;
  const output = logs.join('\n');
  expect(output).toContain('PUNCTUATION(;)');
  expect(output).toContain('\x1b[31mERROR_TOKEN(?)\x1b[0m');
  expect(output).toContain('\x1b[33mIDENTIFIER(==)\x1b[0m');
});

test('diagnostics CLI shows trailing trivia', async () => {
  jest.unstable_mockModule('../src/index.js', () => ({
    tokenize: () => [
      {
        type: 'IDENTIFIER',
        value: 'x',
        leadingTrivia: [{ value: ' ' }],
        trailingTrivia: [{ value: ' ' }],
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 }
      }
    ]
  }));
  const logs = await runDiagnostics(['--trivia']);
  expect(logs.some(l => l.includes('lead→IDENTIFIER'))).toBe(true);
  expect(logs.some(l => l.includes('trail←IDENTIFIER'))).toBe(true);
});
