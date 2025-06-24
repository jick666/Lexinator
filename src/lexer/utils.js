// ────────────────────────────────────────────────────────────
// src/lexer/utils.js 
// ────────────────────────────────────────────────────────────

/* ── generic helpers ──────────────────────────────────────── */
export const isDigit = ch => ch !== null && ch >= '0' && ch <= '9';

/* helper for cheap char collection */
const join = buf => buf.length === 1 ? buf[0] : buf.join('');

/* ── identifier helpers ───────────────────────────────────── */
const ASCII_START_RE = /[A-Za-z_$]/;
const ASCII_PART_RE  = /[A-Za-z0-9_$]/;

const UNICODE_START_RE = /[\p{ID_Start}\p{Math}\p{Emoji}$_]/u;
const UNICODE_PART_RE  = /[\p{ID_Continue}\p{Math}\p{Emoji}$_\u200C\u200D]/u;

export function readUnicodeEscape(stream) {
  const mark = stream.getPosition();
  if (stream.current() !== '\\' || stream.peek() !== 'u') return null;
  stream.advance(); stream.advance();                     // \u

  let cp = 0;
  if (stream.current() === '{') {                         // \u{X…}
    stream.advance();
    const hexBuf = [];
    while (!stream.eof() && /[0-9a-fA-F]/.test(stream.current())) {
      hexBuf.push(stream.current()); stream.advance();
    }
    if (!hexBuf.length || hexBuf.length > 6 || stream.current() !== '}') {
      stream.setPosition(mark); return null;
    }
    stream.advance(); cp = parseInt(join(hexBuf), 16);
  } else {                                                // \uXXXX
    const hexBuf = [];
    for (let i = 0; i < 4; i++) {
      const c = stream.current();
      if (!/[0-9a-fA-F]/.test(c)) { stream.setPosition(mark); return null; }
      hexBuf.push(c); stream.advance();
    }
    cp = parseInt(join(hexBuf), 16);
  }
  return String.fromCodePoint(cp);
}

export function consumeIdentifierLike(
  stream,
  { unicode = true, allowEscape = false } = {}
) {
  const start = stream.getPosition();
  const isStart = unicode ? UNICODE_START_RE : ASCII_START_RE;
  const isPart  = unicode ? UNICODE_PART_RE  : ASCII_PART_RE;

  const buf = [];
  let ch = stream.current();

  // first code-point
  if (allowEscape && ch === '\\' && stream.peek() === 'u') {
    const cp = readUnicodeEscape(stream);
    if (!cp || !isStart.test(cp) || isDigit(cp)) { stream.setPosition(start); return null; }
    buf.push(cp); ch = stream.current();
  } else {
    if (!isStart.test(ch || '') || isDigit(ch) || ch === '#') return null;
    buf.push(ch); stream.advance(); ch = stream.current();
  }

  // rest
  while (ch !== null) {
    if (allowEscape && ch === '\\' && stream.peek() === 'u') {
      const mark = stream.getPosition();
      const cp = readUnicodeEscape(stream);
      if (!cp || !isPart.test(cp)) { stream.setPosition(mark); break; }
      buf.push(cp);
    } else if (isPart.test(ch)) { buf.push(ch); stream.advance(); }
    else break;
    ch = stream.current();
  }
  return join(buf);
}

/* ── numeric helpers ─────────────────────────────────────── */
export function readDigitsWithUnderscores(stream, mark) {
  const buf = [];
  let underscoreSeen = false, lastUnderscore = false, ch = stream.current();

  while (ch !== null && (isDigit(ch) || ch === '_')) {
    if (ch === '_') {
      if (lastUnderscore) { stream.setPosition(mark); return null; }
      underscoreSeen = lastUnderscore = true;
    } else lastUnderscore = false;
    buf.push(ch); stream.advance(); ch = stream.current();
  }
  return { value: join(buf), underscoreSeen, lastUnderscore };
}

export function readNumericWithUnderscores(
  stream,
  mark,
  { requireUnderscore = false, suffix = null } = {}
) {
  if (suffix) {
    let idx = stream.index;
    while (idx < stream.input.length && /[0-9_]/.test(stream.input[idx])) idx++;
    if (stream.input[idx] !== suffix) return null;
  }

  const result = readDigitsWithUnderscores(stream, mark);
  if (!result) return null;

  const { value, underscoreSeen, lastUnderscore } = result;

  if (lastUnderscore || value.startsWith('_') || (requireUnderscore && !underscoreSeen)) {
    stream.setPosition(mark);
    return null;
  }

  let val = value;
  if (suffix) {
    if (stream.current() !== suffix) {
      stream.setPosition(mark);
      return null;
    }
    val += suffix;
    stream.advance();
  }

  return { value: val, endPos: stream.getPosition() };
}

export function readDigits(stream) {
  const buf = [];
  while (isDigit(stream.current())) { buf.push(stream.current()); stream.advance(); }
  return join(buf);
}

export function readNumberLiteral(stream, mark, requireFraction = false) {
  const intPart = readDigits(stream);
  let buf = [intPart];
  let ch = stream.current();

  if (ch === '.') {
    buf.push('.'); stream.advance();
    const frac = readDigits(stream);
    if (!frac && requireFraction) { stream.setPosition(mark); return null; }
    buf.push(frac); ch = stream.current();
  }
  return { value: join(buf), ch };
}

/** Consume exact keyword; return end-pos or null */
export function consumeKeyword(stream, kw, { checkPrev = true } = {}) {
  const mark = stream.getPosition();
  if (checkPrev) {
    const prev = mark.index > 0 ? stream.input[mark.index - 1] : null;
    if (prev && /[A-Za-z0-9_$]/.test(prev)) return null;
  }
  for (const c of kw) { if (stream.current() !== c) { stream.setPosition(mark); return null; } stream.advance(); }
  if (/[A-Za-z0-9_$]/.test(stream.current() || '')) { stream.setPosition(mark); return null; }
  return stream.getPosition();
}

/** Create an identifier reader with common logic */
export function makeIdentifierReader({ unicode = false, allowEscape = false, bailASCII = false } = {}) {
  return function identifierReader(stream, factory) {
    if (bailASCII && (stream.current() === null || stream.current().charCodeAt(0) < 128)) {
      return null;
    }
    const start = stream.getPosition();
    const value = consumeIdentifierLike(stream, { unicode, allowEscape });
    if (value === null) return null;
    return factory('IDENTIFIER', value, start, stream.getPosition());
  };
}
