// @ts-nocheck
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkCoverage } from '../src/utils/checkCoverage.js';

describe('checkCoverage', () => {
  const tmp = path.join('tests', 'tmp');
  const file = path.join(tmp, 'clover.xml');

  beforeEach(() => {
    fs.mkdirSync(tmp, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.rmSync('coverage', { recursive: true, force: true });
  });

  test('passes when coverage meets threshold', () => {
    const xml = `<coverage><project><metrics statements="100" coveredstatements="95"/></project></coverage>`;
    fs.writeFileSync(file, xml);
    expect(checkCoverage(90, file)).toBe(95);
    expect(checkCoverage(undefined, file)).toBe(95);
  });

  test('throws when coverage below threshold', () => {
    const xml = `<coverage><project><metrics statements="100" coveredstatements="85"/></project></coverage>`;
    fs.writeFileSync(file, xml);
    expect(() => checkCoverage(90, file)).toThrow('Coverage 85% below threshold 90%');
  });

  test('throws when metrics missing', () => {
    const xml = `<coverage></coverage>`;
    fs.writeFileSync(file, xml);
    expect(() => checkCoverage(90, file)).toThrow('Metrics not found');
  });

  test('CLI invocation uses default threshold', async () => {
    const xml = `<coverage><project><metrics statements="100" coveredstatements="94"/></project></coverage>`;
    fs.mkdirSync('coverage', { recursive: true });
    fs.writeFileSync(path.join('coverage', 'clover.xml'), xml);
    const mod = '../src/utils/checkCoverage.js';
    jest.resetModules();
    const origArgv = process.argv.slice();
    process.argv = [process.execPath, fileURLToPath(new URL(mod, import.meta.url))];
    await import(mod);
    process.argv = origArgv;
  });

  test('CLI invocation throws on low coverage', async () => {
    const xml = `<coverage><project><metrics statements="100" coveredstatements="80"/></project></coverage>`;
    fs.mkdirSync('coverage', { recursive: true });
    fs.writeFileSync(path.join('coverage', 'clover.xml'), xml);
    const mod = '../src/utils/checkCoverage.js';
    jest.resetModules();
    const origArgv = process.argv.slice();
    process.argv = [process.execPath, fileURLToPath(new URL(mod, import.meta.url)), '85'];
    await expect(import(mod)).rejects.toThrow('Coverage 80% below threshold 85%');
    process.argv = origArgv;
  });

  test('CLI invocation with no script path does not run', async () => {
    const xml = `<coverage><project><metrics statements="100" coveredstatements="92"/></project></coverage>`;
    fs.mkdirSync('coverage', { recursive: true });
    fs.writeFileSync(path.join('coverage', 'clover.xml'), xml);
    const mod = '../src/utils/checkCoverage.js';
    jest.resetModules();
    const origArgv = process.argv.slice();
    process.argv = [process.execPath];
    await import(mod);
    process.argv = origArgv;
  });
});
