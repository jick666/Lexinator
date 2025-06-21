import fs from 'fs';
import path from 'path';
import { checkCoverage } from '../src/utils/checkCoverage.js';

describe('checkCoverage', () => {
  const tmp = path.join('tests', 'tmp');
  const file = path.join(tmp, 'clover.xml');

  beforeEach(() => {
    fs.mkdirSync(tmp, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  test('passes when coverage meets threshold', () => {
    const xml = `<coverage><project><metrics statements="100" coveredstatements="95"/></project></coverage>`;
    fs.writeFileSync(file, xml);
    expect(checkCoverage(90, file)).toBe(95);
  });

  test('throws when coverage below threshold', () => {
    const xml = `<coverage><project><metrics statements="100" coveredstatements="85"/></project></coverage>`;
    fs.writeFileSync(file, xml);
    expect(() => checkCoverage(90, file)).toThrow('Coverage 85% below threshold 90%');
  });
});
