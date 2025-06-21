// src/lexer/TemplateStringReader.js

import { LexerError } from './LexerError.js';

export function TemplateStringReader(stream, factory, engine) {
  if (stream.current() !== '`') return null;
  const start = stream.getPosition();
  const isHTML = engine?.lastToken?.type === 'IDENTIFIER' && engine.lastToken.value === 'html';

  const buf = ['`'];
  stream.advance();

  while (!stream.eof()) {
    const ch = stream.current();

    if (ch === '\\') {                      // escape
      buf.push('\\'); stream.advance();
      if (stream.eof()) return factory('INVALID_TEMPLATE_STRING', buf.join(''), start, stream.getPosition());
      buf.push(stream.current()); stream.advance(); continue;
    }

    if (ch === '`') {                       // done
      buf.push('`'); stream.advance();
      const type = isHTML ? 'HTML_TEMPLATE_STRING' : 'TEMPLATE_STRING';
      return factory(type, buf.join(''), start, stream.getPosition());
    }

    if (ch === '$' && stream.peek() === '{') { // ${ … }
      buf.push('$','{'); stream.advance(); stream.advance();
      let depth = 1;
      while (!stream.eof() && depth) {
        const c = stream.current();

        if (c === '\\') { buf.push('\\'); stream.advance(); if (!stream.eof()) { buf.push(stream.current()); stream.advance(); } continue; }
        if (c === '"' || c === "'") {                 // skip quoted
          const q = c; buf.push(c); stream.advance();
          while (!stream.eof()) {
            const qc = stream.current(); buf.push(qc); stream.advance();
            if (qc === '\\') { if (!stream.eof()) { buf.push(stream.current()); stream.advance(); } continue; }
            if (qc === q) break;
          } continue;
        }
        if (c === '`') {                              // nested template
          const nested = TemplateStringReader(stream, factory);
          if (nested instanceof LexerError) return nested;
          buf.push(nested.value); continue;
        }
        if (c === '{') depth++;
        else if (c === '}') depth--;
        buf.push(c); stream.advance();
      }
      continue;
    }

    buf.push(ch); stream.advance();
  }
  return new LexerError('UnterminatedTemplate','Unterminated template literal',start,stream.getPosition(),stream.input);
}
