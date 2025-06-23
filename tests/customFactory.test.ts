// @ts-nocheck
import { test, expect } from '@jest/globals';
import { CharStream } from '../src/lexer/CharStream.js';
import { LexerEngine } from '../src/lexer/LexerEngine.js';
import { Token } from '../src/lexer/Token.js';

test('custom createToken option tags tokens', () => {
   const captured = [];
   const createToken = (type, val, s, e, src) => {
     const tok = new Token(type, val, s, e, src);
     tok.tagged = true;
     captured.push(tok);
     return tok;
   };
   const engine = new LexerEngine(new CharStream('1'), { createToken });
   const tok = engine.nextToken();
   expect(tok.tagged).toBe(true);
   expect(captured[0]).toBe(tok);
 });

