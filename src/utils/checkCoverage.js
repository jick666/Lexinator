import fs from 'fs';

export function checkCoverage(threshold = 90, reportPath = 'coverage/clover.xml') {
  const xml = fs.readFileSync(reportPath, 'utf8');
  const metrics = xml.match(/<metrics[^>]+>/);
  if (!metrics) throw new Error('Metrics not found in coverage report');
  const attrs = Object.fromEntries([...metrics[0].matchAll(/(\w+)="(\d+)"/g)].map(m => [m[1], Number(m[2])]));
  const pct = Math.round((attrs.coveredstatements / attrs.statements) * 100);
  if (pct < threshold) {
    throw new Error(`Coverage ${pct}% below threshold ${threshold}%`);
  }
  return pct;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, file, thr] = process.argv;
  checkCoverage(thr ? Number(thr) : 90, file);
}
