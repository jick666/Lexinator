// src/lexer/ImportAssertionReader.js

export function ImportAssertionReader(stream, factory) {
  const start = stream.getPosition();
  if (!stream.input.startsWith('assert', stream.index)) return null;

  const buf = [];
  for (const c of 'assert') { if (stream.current() !== c) { stream.setPosition(start); return null; } buf.push(c); stream.advance(); }

  const next = stream.current();
  if (next !== ':' && next !== '{' && !/\s/.test(next)) { stream.setPosition(start); return null; }

  while (/\s/.test(stream.current() || '')) { buf.push(stream.current()); stream.advance(); }

  if (stream.current() === ':') {
    buf.push(':'); stream.advance();
    while (/\s/.test(stream.current() || '')) { buf.push(stream.current()); stream.advance(); }
  }

  if (stream.current() !== '{') { stream.setPosition(start); return null; }

  buf.push('{'); stream.advance();
  let depth = 1, inStr = null;
  while (!stream.eof() && depth) {
    const ch = stream.current(); buf.push(ch); stream.advance();

    if (inStr) {
      if (ch === '\\') { if (!stream.eof()) { buf.push(stream.current()); stream.advance(); } continue; }
      if (ch === inStr) inStr = null; continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth++; else if (ch === '}') depth--;
  }
  if (depth) { stream.setPosition(start); return null; }
  return factory('IMPORT_ASSERTION', buf.join(''), start, stream.getPosition());
}
