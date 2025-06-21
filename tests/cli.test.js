import { jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { tokenize } from '../src/index.js';

/**
 * Helper to execute the CLI entry with mocked process args.
 * @param {string[]} args
 */
async function runCli(args) {
  jest.resetModules();
  const cliPath = fileURLToPath(new URL('../src/index.js', import.meta.url));
  const originalArgv = process.argv.slice();
  process.argv = [process.execPath, cliPath, ...args];

  const logs = [];
  const errors = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (msg) => logs.push(msg);
  console.error = (msg) => errors.push(msg);

  let exitCode;
  const originalExit = process.exit;
  process.exit = (code) => { exitCode = code; };

  await import('../src/index.js');

  // restore
  console.log = originalLog;
  console.error = originalError;
  process.exit = originalExit;
  process.argv = originalArgv;

  return { logs, errors, exitCode };
}

test('CLI prints tokens array for valid input', async () => {
  const result = await runCli(['let x=1;']);
  expect(Array.isArray(result.logs[0])).toBe(true);
  expect(result.logs[0].map(t => t.type)).toEqual([
    'KEYWORD', 'IDENTIFIER', 'OPERATOR', 'NUMBER', 'PUNCTUATION'
  ]);
  expect(result.exitCode).toBeUndefined();
});

test('CLI handles invalid regex without exiting', async () => {
  const result = await runCli(['/abc']);
  expect(result.exitCode).toBeUndefined();
  expect(Array.isArray(result.logs[0])).toBe(true);
  expect(result.logs[0][0].type).toBe('INVALID_REGEX');
});

test('CLI uses empty input when none provided', async () => {
  const result = await runCli([]);
  expect(result.logs[0]).toEqual([]);
  expect(result.exitCode).toBeUndefined();
});

test('CLI exits on lexer error', async () => {
  const result = await runCli(['"abc']);
  expect(result.exitCode).toBe(1);
  expect(result.errors.length).toBeGreaterThan(0);
});

test('tokenize logs tokens when verbose', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  tokenize('let x=1;', { verbose: true });
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
