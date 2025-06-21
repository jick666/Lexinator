// ─── src/lexer/RegexOrDivideReader.js ───────────────────────────────────────
import matchProp      from 'unicode-match-property-ecmascript';
import matchPropValue from 'unicode-match-property-value-ecmascript';

/* ── tiny helpers ───────────────────────────────────────────────────────────*/
const WS     = new Set([' ', '\t', '\n', '\r', '\v', '\f']);
const STARTS = new Set(['(', '{', '[', '=', ':', ',', ';', '!', '?', '+',
                        '-', '*', '%', '&', '|', '^', '~', '<', '>']);

const inRegexContext = (stream, at) => {
  let i = at - 1;
  while (i >= 0 && WS.has(stream.input[i])) i--;
  return i < 0 || STARTS.has(stream.input[i]);
};

const makeOp = (stream, f, start, val) => {
  for (let i = 0; i < val.length; i++) stream.advance();
  return f('OPERATOR', val, start, stream.getPosition());
};

const validateUnicodeProp = expr => {
  const sep = expr.indexOf('=');
  if (sep !== -1) {
    const prop = matchProp(expr.slice(0, sep));
    matchPropValue(prop, expr.slice(sep + 1));
  } else {
    try { matchProp(expr); }
    catch { matchPropValue('General_Category', expr); }
  }
};

/* ── main regex-literal reader ──────────────────────────────────────────────*/
function readRegexLiteral(stream, f, start, opts) {
  stream.advance();                        // leading '/'

  const body  = [];
  let esc     = false;                     // true → *next* rune is escaped
  let depth   = 0;                         // [...] nesting depth

  while (!stream.eof()) {
    const ch = stream.current();

    /* already escaped → copy literally & reset flag -----------------------*/
    if (esc) {
      body.push(ch);
      stream.advance();
      esc = false;
      continue;
    }

    /* back-slash introduces an escape -------------------------------------*/
    if (ch === '\\') {
      const next = stream.peek();

      /* Unicode property escape (\p{…} / \P{…}) ---------------------------*/
      if ((next === 'p' || next === 'P') && stream.peek(2) === '{') {
        body.push('\\', next, '{');
        stream.advance();                // '\'
        stream.advance();                // 'p' | 'P'
        stream.advance();                // '{'

        const prop = [];
        while (!stream.eof() && stream.current() !== '}') {
          const c = stream.current();
          if (!/[A-Za-z0-9_=^:-]/.test(c)) {
            return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
          }
          prop.push(c);
          body.push(c);
          stream.advance();
        }
        if (stream.current() !== '}') {
          return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
        }
        body.push('}');
        stream.advance();               // '}'

        if (opts?.validateUnicodeProperties) {
          try { validateUnicodeProp(prop.join('').replace(/^\^/, '')); }
          catch {
            return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
          }
        }
        continue;
      }

      /* simple one-char escape --------------------------------------------*/
      esc = true;                        // flag for next rune
      body.push('\\');
      stream.advance();
      continue;
    }

    /* bookkeeping inside character classes --------------------------------*/
    if      (ch === '[') depth++;
    else if (ch === ']') depth = Math.max(0, depth - 1);
    else if (ch === '/' && depth === 0) break; // end of body

    body.push(ch);
    stream.advance();
  }

  /* unterminated ----------------------------------------------------------*/
  if (depth !== 0 || stream.current() !== '/') {
    return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
  }

  stream.advance();                        // closing '/'

  /* flags ------------------------------------------------------------------*/
  const flags = [];
  while (!stream.eof() && /[A-Za-z]/.test(stream.current())) {
    flags.push(stream.current());
    stream.advance();
  }

  const bodyStr = body.join('');
  const flagStr = flags.join('');

  /* invalid capture-group names (must not start with a digit) --------------*/
  if (/\(\?<\d/.test(bodyStr)) {
    return f('INVALID_REGEX', `/${bodyStr}/${flagStr}`, start, stream.getPosition());
  }

  return f('REGEX', `/${bodyStr}/${flagStr}`, start, stream.getPosition());
}

/* ── public reader entry-point ─────────────────────────────────────────────*/
export function RegexOrDivideReader(stream, factory, opts) {
  const start = stream.getPosition();
  if (stream.current() !== '/') return null;

  /* “/=” operator */
  if (stream.peek() === '=') {
    return makeOp(stream, factory, start, '/=');
  }

  /* divide op  vs  regex literal? */
  if (!inRegexContext(stream, start.index)) {
    return makeOp(stream, factory, start, '/');
  }

  /* regex literal */
  return readRegexLiteral(stream, factory, start, opts);
}
