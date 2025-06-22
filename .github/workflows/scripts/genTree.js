#!/usr/bin/env node
/**
 * genTree.js – agent-only helper
 *
 * • Prints a compact directory tree (skipping dot-files, node_modules, etc.).
 * • Overwrites 'fileStructure.txt' in repo root and stages it with `git add`
 *   when invoked via the yarn script ("yarn tree").
 */
import fs   from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const IGNORED = new Set([
  '.git', '.github', '.husky', 'node_modules',
  'coverage', 'dist', 'build', '.DS_Store'
]);

function walk (dir, prefix = '', out = []) {
  fs.readdirSync(dir)
    .filter(n => !IGNORED.has(n) && !n.startsWith('.'))
    .sort()
    .forEach((name, i, arr) => {
      const last = i === arr.length - 1;
      const full = path.join(dir, name);
      out.push(`${prefix}${last ? '└── ' : '├── '}${name}`);
      if (fs.statSync(full).isDirectory()) {
        walk(full, `${prefix}${last ? '    ' : '│   '}`, out);
      }
    });
  return out;
}

const root = process.cwd();
const tree = ['📂 ' + path.basename(root), ...walk(root)].join('\n');
console.log(tree);

// If invoked via npm run tree, the lifecycle event is set
if (process.env.npm_lifecycle_event === 'tree') {
  fs.writeFileSync('fileStructure.txt', tree + '\n');
  // stage so that Codex / PR diff includes the update
  spawnSync('git', ['add', 'fileStructure.txt'], { stdio: 'ignore' });
}
