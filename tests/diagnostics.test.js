import { jest } from '@jest/globals';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

async function runDiagnostics(args = [], env = {}) {
  jest.resetModules();
  const diagPath = fileURLToPath(new URL('../src/utils/diagnostics.js', import.meta.url));
  const originalArgv = process.argv.slice();
  const originalEnv = { ...process.env };
  process.argv = [process.execPath, diagPath, ...args];
  Object.assign(process.env, env);

  const logs = [];
  const originalLog = console.log;
  console.log = (msg) => logs.push(msg);

  await import('../src/utils/diagnostics.js');

  console.log = originalLog;
  process.argv = originalArgv;
  process.env = originalEnv;
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

test('diagnostics CLI prints debug indices', async () => {
  const logs = await runDiagnostics(['--debug', 'let x=1;']);
  expect(logs[0].startsWith('0')).toBe(true);
});

test('diagnostics CLI shows trivia output', async () => {
  const logs = await runDiagnostics(['--trivia', '  x;']);
  expect(logs.some(l => l.includes('lead→'))).toBe(true);
});
