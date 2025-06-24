import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync } from 'fs';
import { performance } from 'perf_hooks';
import { tokenize } from '../../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function gatherFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      return gatherFiles(full);
    }
    return entry.isFile() && entry.name.endsWith('.js') ? [full] : [];
  });
}

function benchmark(filePath, iterations = 10) {
  const code = readFileSync(filePath, 'utf8');
  const start = performance.now();
  try {
    for (let i = 0; i < iterations; i++) {
      tokenize(code);
    }
  } catch (e) {
    console.log(`${basename(filePath)}: FAILED (${e.message})`);
    return;
  }
  const seconds = (performance.now() - start) / 1000;
  const bytes = Buffer.byteLength(code) * iterations;
  const mbps = bytes / (1024 * 1024) / seconds;
  console.log(`${basename(filePath)}: ${mbps.toFixed(2)} MB/s`);
}

(function main() {
  const srcDir = join(__dirname, '..', '..', 'src');
  const files = gatherFiles(srcDir);
  if (files.length === 0) {
    console.error('No source files found');
    process.exit(1);
  }
  files.forEach(f => benchmark(f, 20));
})();
