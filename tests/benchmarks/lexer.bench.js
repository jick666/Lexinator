import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync } from 'fs';
import { performance } from 'perf_hooks';
// Import tokenizer from project source.
import { tokenize } from '../../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function benchmark(filePath, iterations = 50) {
  const code = readFileSync(filePath, 'utf8');
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    tokenize(code);
  }
  const seconds = (performance.now() - start) / 1000;
  const bytes = Buffer.byteLength(code) * iterations;
  const mbps = bytes / (1024 * 1024) / seconds;
  console.log(`${basename(filePath)}: ${mbps.toFixed(2)} MB/s`);
}

(function main() {
  const fixtureDir = join(__dirname, '..', 'fixtures');
  const files = readdirSync(fixtureDir).filter(f => f.endsWith('.js'));
  if (files.length === 0) {
    console.error('No fixture files found in tests/fixtures');
    process.exit(1);
  }
  files.forEach(f => benchmark(join(fixtureDir, f)));
})();
