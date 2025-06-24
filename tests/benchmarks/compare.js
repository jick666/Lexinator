import fs from 'fs';

function parseBench(path) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/);
  const data = {};
  for (const line of lines) {
    const match = line.match(/([^:]+):\s*(\d+(?:\.\d+)?)\s+MB\/s/);
    if (match) {
      data[match[1]] = parseFloat(match[2]);
    }
  }
  return data;
}

function compare(base, current, threshold = Number(process.env.BENCH_THRESH_PCT) || 10) {
  const report = [];
  for (const [name, speed] of Object.entries(current)) {
    const prev = base[name];
    if (prev != null) {
      const diff = ((speed - prev) / prev) * 100;
      const sign = diff >= 0 ? '+' : '';
      report.push(`${name}: ${speed.toFixed(2)} MB/s (${sign}${diff.toFixed(1)}%)`);
      if (Math.abs(diff) > threshold) {
        report.push(`WARNING: ${name} changed by ${diff.toFixed(1)}%`);
      }
    } else {
      report.push(`${name}: ${speed.toFixed(2)} MB/s (new)`);
    }
  }
  return report.join('\n') + '\n';
}

const [,, baselinePath, benchPath] = process.argv;
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : {};
const current = parseBench(benchPath);
fs.writeFileSync(benchPath, JSON.stringify(current, null, 2));
const report = compare(baseline, current);
fs.writeFileSync('bench-report.txt', report);
