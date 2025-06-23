// ─── src/lexer/RegexOrDivideReader.ts ───────────────────────────────────────
import matchProp from 'unicode-match-property-ecmascript';
import matchPropValue from 'unicode-match-property-value-ecmascript';

import type { CharStream } from './CharStream.js';
import type { Token } from './Token.js';

export interface RegexOptions {
  validateUnicodeProperties?: boolean;
}

export type TokenFactory = (
  type: string,
  value: string,
  start: any,
  end: any
) => Token;

/* ── tiny helpers ───────────────────────────────────────────────────────────*/
const WS = new Set([' ', '\t', '\n', '\r', '\v', '\f']);
const STARTS = new Set([
  '(', '{', '[', '=', ':', ',', ';', '!', '?', '+', '-', '*', '%',
  '&', '|', '^', '~', '<', '>'
]);

const inRegexContext = (stream: CharStream, at: number): boolean => {
  let i = at - 1;
  while (i >= 0 && WS.has(stream.input[i]!)) i--;
  return i < 0 || STARTS.has(stream.input[i]!);
};

const makeOp = (
  stream: CharStream,
  f: TokenFactory,
  start: any,
  val: string
): Token => {
  for (let i = 0; i < val.length; i++) stream.advance();
  return f('OPERATOR', val, start, stream.getPosition());
};

const validateUnicodeProp = (expr: string): void => {
  const sep = expr.indexOf('=');
  if (sep !== -1) {
    const prop = matchProp(expr.slice(0, sep));
    matchPropValue(prop, expr.slice(sep + 1));
  } else {
    try {
      matchProp(expr);
    } catch {
      matchPropValue('General_Category', expr);
    }
  }
};

/* ── main regex-literal reader ──────────────────────────────────────────────*/
function readRegexLiteral(
  stream: CharStream,
  f: TokenFactory,
  start: any,
  opts?: RegexOptions
): Token {
  stream.advance();

  const body: string[] = [];
  let esc = false;
  let depth = 0;

  while (!stream.eof()) {
    const ch = stream.current();

    if (esc) {
      body.push(ch!);
      stream.advance();
      esc = false;
      continue;
    }

    if (ch === '\\') {
      const next = stream.peek();

      if ((next === 'p' || next === 'P') && stream.peek(2) === '{') {
        body.push('\\', next!, '{');
        stream.advance();
        stream.advance();
        stream.advance();

        const prop: string[] = [];
        while (!stream.eof() && stream.current() !== '}') {
          const c = stream.current();
          if (!/[A-Za-z0-9_=^:-]/.test(c!)) {
            return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
          }
          prop.push(c!);
          body.push(c!);
          stream.advance();
        }
        if (stream.current() !== '}') {
          return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
        }
        body.push('}');
        stream.advance();

        if (opts?.validateUnicodeProperties) {
          try {
            validateUnicodeProp(prop.join('').replace(/^\^/, ''));
          } catch {
            return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
          }
        }
        continue;
      }

      esc = true;
      body.push('\\');
      stream.advance();
      continue;
    }

    if (ch === '[') depth++;
    else if (ch === ']') depth = Math.max(0, depth - 1);
    else if (ch === '/' && depth === 0) break;

    body.push(ch!);
    stream.advance();
  }

  if (depth !== 0 || stream.current() !== '/') {
    return f('INVALID_REGEX', `/${body.join('')}`, start, stream.getPosition());
  }

  stream.advance();

  const flags: string[] = [];
  while (!stream.eof() && /[A-Za-z]/.test(stream.current()!)) {
    flags.push(stream.current()!);
    stream.advance();
  }

  const bodyStr = body.join('');
  const flagStr = flags.join('');

  if (/\(\?<\d/.test(bodyStr)) {
    return f('INVALID_REGEX', `/${bodyStr}/${flagStr}`, start, stream.getPosition());
  }

  return f('REGEX', `/${bodyStr}/${flagStr}`, start, stream.getPosition());
}

/* ── public reader entry-point ─────────────────────────────────────────────*/
export function RegexOrDivideReader(
  stream: CharStream,
  factory: TokenFactory,
  opts?: RegexOptions
): Token | null {
  const start = stream.getPosition();
  if (stream.current() !== '/') return null;

  if (stream.peek() === '=') {
    return makeOp(stream, factory, start, '/=');
  }

  if (!inRegexContext(stream, start.index)) {
    return makeOp(stream, factory, start, '/');
  }

  return readRegexLiteral(stream, factory, start, opts);
}
