#!/usr/bin/env node
/*  Lexinator – diagnostics “all-in-one”                                *
 *  ------------------------------------------------------------------ *
 *  - token dump (colour-coded)        - per-line token map            *
 *  - timing metrics                  - histogram                     *
 *  - mode-transition trace           - bracket-depth heat-map        *
 *  - trivia visualiser (--trivia)    - Unicode sanity check          *
 *  - JSON export (env JSON=1)        - char-index guide (--debug)    *
 *  - interactive REPL (--repl)       - CLI help (--help)             */

import fs from 'fs';
import { performance } from 'perf_hooks';
import { createInterface } from 'readline';
import { tokenize } from '../index.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { analyseTokens, unicodeBad, maxDepth, lineMap } from './tokenAnalysis.js';

/* ── ANSI helper ─────────────────────────────────────────────────── */
const clr = (c, s) =>
  `\x1b[${{ red:31, green:32, yellow:33, cyan:36, magenta:35 }[c]}m${s}\x1b[0m`;

/* ── HELP flag ───────────────────────────────────────────────────── */
if (process.argv.includes('--help')) {
  console.log(`
usage: diagnostics.js [options] [code …]      cat file.js | diagnostics.js

options
  --debug     show 0-based char indices above each snippet
  --trivia    visualise leading / trailing whitespace tokens
  --repl      interactive prompt
  --help      this help

env
  JSON=1      emit raw token arrays as JSON (suppresses pretty output)
`);
  process.exit(0);
}

/* ── REPL mode ───────────────────────────────────────────────────── */
if (process.argv.includes('--repl')) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.setPrompt('lex> ');
  rl.prompt();
  rl.on('line', l => {
    console.log(tokenize(l).map(t => `${t.type}(${t.value})`).join('  '));
    rl.prompt();
  });
  rl.on('close', () => process.exit(0));
  // no fall-through
}

/* ── mode-transition logging (monkey-patch) ─────────────────────── */
const modeLog = [];
const pushOrig = LexerEngine.prototype.pushMode;
const popOrig  = LexerEngine.prototype.popMode;
LexerEngine.prototype.pushMode = function (m) {
  modeLog.push(['▶', m, this.stream.index]);
  return pushOrig.call(this, m);
};
LexerEngine.prototype.popMode = function () {
  const m = this.currentMode();
  modeLog.push(['◀', m, this.stream.index]);
  return popOrig.call(this);
};

/* ── snippet gathering ──────────────────────────────────────────── */
function getSnippets() {
  const args = process.argv.filter(a => !a.startsWith('--')).slice(2);
  if (args.length) return args;
  if (!process.stdin.isTTY)
    return fs.readFileSync(0, 'utf8').split(/\r?\n/).filter(Boolean);
  return [
    'let x = 5;',
    'let x=1;',
    'a |> b',
    'const r = /ab+c/;',
    'function f(){ return 1n ?? obj?.p; }'
  ];
}

/* ── helpers ─────────────────────────────────────────────────────── */
const opLike = /^(\|>|==?=?|!==?|<=?|>=?|[-+*/%]=?)$/;
const fmtTok = t => {
  const base = `${t.type}(${t.value})`;
  if (t.type === 'ERROR_TOKEN' || t.type.startsWith('INVALID')) return clr('red', base);
  if (t.type === 'IDENTIFIER' && opLike.test(t.value))          return clr('yellow', base);
  return base;
};
const bar = (v, max) => '#'.repeat(Math.round(v / max * 20));

const vis = s => s.replace(/\n/g, '⏎').replace(/\t/g, '⇥').replace(/ /g, '·');
function showTrivia(toks) {
  toks.forEach(t => {
    t.leadingTrivia?.forEach(v => console.log(`lead→${t.type}@${t.start.line}:${t.start.column}`, vis(v.value)));
    t.trailingTrivia?.forEach(v => console.log(`trail←${t.type}@${t.end.line}:${t.end.column}`, vis(v.value)));
  });
}

/* ── MAIN diagnostics loop ──────────────────────────────────────── */
for (const code of getSnippets()) {
  modeLog.length = 0;

  if (process.argv.includes('--debug'))
    console.log(code.split('').map((c, i) => (i % 10 ? c : String(i / 10 | 0))).join(''));

  const t0 = performance.now();
  const tokens = tokenize(code);
  const delta = performance.now() - t0;

  if (process.env.JSON) { console.log(JSON.stringify(tokens, null, 2)); continue; }

  const { stats, problems } = analyseTokens(tokens);

  console.log(clr('cyan', `\n=== ${code} ===`));
  console.log(tokens.map(fmtTok).join('  '));

  console.log(clr('magenta', '\n· per-line map:'));
  for (const [ln, arr] of lineMap(tokens))
    console.log(`${String(ln).padStart(3)} ▸ ${arr.map(fmtTok).join('  ')}`);

  const maxCnt = Math.max(...stats.values());
  console.log(clr('magenta', '\n· histogram'));
  [...stats].sort((a, b) => a[0].localeCompare(b[0]))
            .forEach(([k, v]) => console.log(`${k.padEnd(18)} ${bar(v, maxCnt)} ${v}`));

  console.log(clr('magenta', `\n· timing: ${delta.toFixed(2)} ms`));
  console.log(clr('magenta', `· max nesting depth: ${maxDepth(tokens)}`));

  if (modeLog.length) {
    console.log(clr('magenta', '· mode transitions:'));
    modeLog.forEach(([s, m, i]) => console.log(`  ${s} ${m} @${i}`));
  }

  const uni = unicodeBad(tokens);
  if (uni.length) {
    console.log(clr('red', '\n· malformed unicode identifiers:'));
    uni.forEach(t => console.log(`  line ${t.start.line} “${t.value}”`));
  }

  if (process.argv.includes('--trivia')) showTrivia(tokens);

  if (problems.length) {
    console.log(clr('red', '\n· potential issues:'));
    problems.forEach(p => console.log(`  - ${p.msg} @ ${p.line}:${p.col} “${p.val}”`));
  } else {
    console.log(clr('green', '\n· no obvious issues'));
  }
}
