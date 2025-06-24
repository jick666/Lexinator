import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tokenize } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = ['lexer_engine.js', 'template_string_reader.js'];
const FIXTURE_DIR = path.join(__dirname, 'fixtures');

describe('fixture snapshots', () => {
  test.each(FIXTURES)('%s tokens snapshot', file => {
    const src = fs.readFileSync(path.join(FIXTURE_DIR, file), 'utf8');
    expect(tokenize(src)).toMatchSnapshot();
  });
});
