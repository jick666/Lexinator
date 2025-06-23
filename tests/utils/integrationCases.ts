// @ts-nocheck
import { ASSIGNMENT_TYPES } from './tokenTypeUtils.js';

export const integrationCases = [
  {
    desc: 'var declaration',
    src: 'let x = 5;',
    types: ASSIGNMENT_TYPES
  },
  {
    desc: 'trailing whitespace does not produce null token',
    src: 'let x = 5;   ',
    types: ASSIGNMENT_TYPES,
    noNull: true
  },
  {
    desc: 'tokenize returns INVALID_REGEX token on unterminated regex',
    src: '/abc',
    types: ['INVALID_REGEX']
  },
  {
    desc: 'bigint and optional chaining',
    src: 'let x = 1n ?? obj?.prop;',
    types: ['KEYWORD','IDENTIFIER','OPERATOR','BIGINT','OPERATOR','IDENTIFIER','OPERATOR','IDENTIFIER','PUNCTUATION']
  },
  {
    desc: 'hex literals',
    src: 'let n = 0x1A;',
    types: ASSIGNMENT_TYPES,
    valueIndex: 3,
    value: '0x1A'
  },
  {
    desc: 'numeric separator with exponent splits tokens',
    src: 'let n = 1_0e3;',
    types: ['KEYWORD','IDENTIFIER','OPERATOR','NUMBER','IDENTIFIER','PUNCTUATION']
  },
  {
    desc: 'binary literal',
    src: 'let n = 0b1010;',
    types: ASSIGNMENT_TYPES,
    valueIndex: 3,
    value: '0b1010'
  },
  {
    desc: 'octal literal',
    src: 'let n = 0o755;',
    types: ASSIGNMENT_TYPES,
    valueIndex: 3,
    value: '0o755'
  },
  {
    desc: 'exponent literal',
    src: 'let n = 1e3;',
    types: ASSIGNMENT_TYPES,
    valueIndex: 3,
    value: '1e3'
  },
  {
    desc: 'unicode identifiers',
    src: 'let πδ = 1;',
    types: ASSIGNMENT_TYPES,
    valueIndex: 1,
    value: 'πδ'
  },
  {
    desc: 'shebang comment',
    src: '#!/usr/bin/env node\nlet a = 1;',
    types: ['COMMENT','KEYWORD','IDENTIFIER','OPERATOR','NUMBER','PUNCTUATION'],
    valueIndex: 0,
    value: '#!/usr/bin/env node'
  },
  {
    desc: 'byte order mark',
    src: '\uFEFFlet a = 1;',
    types: ['BOM','KEYWORD','IDENTIFIER','OPERATOR','NUMBER','PUNCTUATION']
  },
  {
    desc: 'html comments',
    src: '<!-- hidden -->\nlet a = 1;',
    types: ['COMMENT','KEYWORD','IDENTIFIER','OPERATOR','NUMBER','PUNCTUATION'],
    valueIndex: 0,
    value: '<!-- hidden -->'
  },
  {
    desc: 'pipeline operator',
    src: 'a |> b',
    types: ['IDENTIFIER','PIPELINE_OPERATOR','IDENTIFIER']
  },
  {
    desc: 'bind operator',
    src: 'obj::method',
    types: ['IDENTIFIER','BIND_OPERATOR','IDENTIFIER']
  },
  {
    desc: 'private identifiers',
    src: 'class C { #a; #b() {} }',
    types: ['KEYWORD','IDENTIFIER','PUNCTUATION','PRIVATE_IDENTIFIER','PUNCTUATION','PRIVATE_IDENTIFIER','PUNCTUATION','PUNCTUATION','PUNCTUATION','PUNCTUATION','PUNCTUATION']
  },
  {
    desc: 'import assertions',
    src: 'import data from "./d.json" assert { type: "json" };',
    types: ['KEYWORD','IDENTIFIER','IDENTIFIER','STRING','IMPORT_ASSERTION','PUNCTUATION']
  },
  {
    desc: 'dynamic import assertions',
    src: 'import("./d.json", { assert: { type: "json" } });',
    types: ['KEYWORD','PUNCTUATION','STRING','PUNCTUATION','PUNCTUATION','IMPORT_ASSERTION','PUNCTUATION','PUNCTUATION','PUNCTUATION']
  },
  {
    desc: 'record and tuple literals',
    src: '#{a:1} #[1]',
    types: ['RECORD_START','IDENTIFIER','NUMBER','PUNCTUATION','TUPLE_START','NUMBER','PUNCTUATION']
  },
  {
    desc: 'module blocks',
    src: 'module { let x = 1; }',
    types: ['MODULE_BLOCK_START','KEYWORD','IDENTIFIER','OPERATOR','NUMBER','PUNCTUATION','MODULE_BLOCK_END']
  },
  {
    desc: 'using statement',
    src: 'using x = foo();',
    types: ['USING','IDENTIFIER','OPERATOR','IDENTIFIER','PUNCTUATION','PUNCTUATION','PUNCTUATION']
  },
  {
    desc: 'await using statement',
    src: 'await using y = bar();',
    types: ['AWAIT_USING','IDENTIFIER','OPERATOR','IDENTIFIER','PUNCTUATION','PUNCTUATION','PUNCTUATION']
  },
  {
    desc: 'pattern matching tokens',
    src: 'match (x) { case 1: }',
    types: ['MATCH','PUNCTUATION','IDENTIFIER','PUNCTUATION','PUNCTUATION','CASE','NUMBER','PUNCTUATION']
  },
  {
    desc: 'function.sent meta property',
    src: 'function.sent;',
    types: ['FUNCTION_SENT','PUNCTUATION']
  }
];
