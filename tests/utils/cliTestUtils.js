import { jest } from '@jest/globals';
import { fileURLToPath, pathToFileURL } from 'url';

/**
 * Run a CLI module and capture console output.
 * @param {string} modulePath - path relative to project root.
 * @param {{args?: string[], env?: object, stdinTTY?: boolean, exitFn?: Function}} [options]
 * @returns {Promise<{logs: string[], errors: string[], exitCode: number|undefined}>}
 */
export async function runCliModule(modulePath, options = {}) {
  const {
    args = [],
    env = {},
    stdinTTY = true,
    exitFn,
  } = options;

  jest.resetModules();
  const absUrl = new URL(modulePath, pathToFileURL(process.cwd() + '/'));
  const cliPath = fileURLToPath(absUrl);
  const originalArgv = process.argv.slice();
  const originalEnv = { ...process.env };
  const originalExit = process.exit;
  const originalTTY = process.stdin.isTTY;
  let exitCode;

  process.argv = [process.execPath, cliPath, ...args];
  Object.assign(process.env, env);
  process.stdin.isTTY = stdinTTY;
  process.exit = exitFn || ((code) => { exitCode = code; });

  const logs = [];
  const errors = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (msg) => logs.push(msg);
  console.error = (msg) => errors.push(msg);

  await import(absUrl.href);

  console.log = originalLog;
  console.error = originalError;
  process.exit = originalExit;
  process.argv = originalArgv;
  process.env = originalEnv;
  process.stdin.isTTY = originalTTY;

  return { logs, errors, exitCode };
}
