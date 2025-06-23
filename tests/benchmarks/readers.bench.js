import { performance } from 'perf_hooks';
import { CharStream } from '../../src/lexer/CharStream.js';
import { Token } from '../../src/lexer/Token.js';
import { HTMLCommentReader } from '../../src/lexer/HTMLCommentReader.js';
import { SourceMappingURLReader } from '../../src/lexer/SourceMappingURLReader.js';
import { CommentReader } from '../../src/lexer/CommentReader.js';
import { UnicodeWhitespaceReader } from '../../src/lexer/UnicodeWhitespaceReader.js';
import { ByteOrderMarkReader } from '../../src/lexer/ByteOrderMarkReader.js';
import { ShebangReader } from '../../src/lexer/ShebangReader.js';
import { PrivateIdentifierReader } from '../../src/lexer/PrivateIdentifierReader.js';
import { DoExpressionReader } from '../../src/lexer/DoExpressionReader.js';
import { ModuleBlockReader } from '../../src/lexer/ModuleBlockReader.js';
import { UsingStatementReader } from '../../src/lexer/UsingStatementReader.js';
import { PatternMatchReader } from '../../src/lexer/PatternMatchReader.js';
import { FunctionSentReader } from '../../src/lexer/FunctionSentReader.js';
import { ImportAssertionReader } from '../../src/lexer/ImportAssertionReader.js';
import { RecordAndTupleReader } from '../../src/lexer/RecordAndTupleReader.js';
import { IdentifierReader } from '../../src/lexer/IdentifierReader.js';
import { UnicodeIdentifierReader } from '../../src/lexer/UnicodeIdentifierReader.js';
import { UnicodeEscapeIdentifierReader } from '../../src/lexer/UnicodeEscapeIdentifierReader.js';
import { HexReader } from '../../src/lexer/number/HexReader.js';
import { BinaryReader } from '../../src/lexer/number/BinaryReader.js';
import { OctalReader } from '../../src/lexer/number/OctalReader.js';
import { BigIntReader } from '../../src/lexer/number/BigIntReader.js';
import { DecimalLiteralReader } from '../../src/lexer/number/DecimalLiteralReader.js';
import { NumericSeparatorReader } from '../../src/lexer/number/NumericSeparatorReader.js';
import { ExponentReader } from '../../src/lexer/number/ExponentReader.js';
import { NumberReader } from '../../src/lexer/number/NumberReader.js';
import { StringReader } from '../../src/lexer/StringReader.js';
import { RegexOrDivideReader } from '../../src/lexer/RegexOrDivideReader.js';
import { PipelineOperatorReader } from '../../src/lexer/PipelineOperatorReader.js';
import { BindOperatorReader } from '../../src/lexer/BindOperatorReader.js';
import { OperatorReader } from '../../src/lexer/OperatorReader.js';
import { PunctuationReader } from '../../src/lexer/PunctuationReader.js';
import { TemplateStringReader } from '../../src/lexer/TemplateStringReader.js';
import { JSXReader } from '../../src/lexer/JSXReader.js';

const readers = {
  HTMLCommentReader: ['<!--a-->', HTMLCommentReader],
  SourceMappingURLReader: ['//# sourceMappingURL=a.js\n', SourceMappingURLReader],
  CommentReader: ['// cmt', CommentReader],
  UnicodeWhitespaceReader: ['\u00A0', UnicodeWhitespaceReader],
  ByteOrderMarkReader: ['\uFEFFx', ByteOrderMarkReader],
  ShebangReader: ['#!/usr/bin/env node\n', ShebangReader],
  PrivateIdentifierReader: ['#x', PrivateIdentifierReader],
  DoExpressionReader: ['do { }', DoExpressionReader],
  ModuleBlockReader: ['module { }', ModuleBlockReader],
  UsingStatementReader: ['using x', UsingStatementReader],
  PatternMatchReader: ['match x', PatternMatchReader],
  FunctionSentReader: ['function.sent', FunctionSentReader],
  ImportAssertionReader: ['assert { type: "json" }', ImportAssertionReader],
  RecordAndTupleReader: ['#[1,2]', RecordAndTupleReader],
  IdentifierReader: ['foo', IdentifierReader],
  UnicodeIdentifierReader: ['πδ', UnicodeIdentifierReader],
  UnicodeEscapeIdentifierReader: ['\\u0041', UnicodeEscapeIdentifierReader],
  HexReader: ['0xFF', HexReader],
  BinaryReader: ['0b10', BinaryReader],
  OctalReader: ['0o7', OctalReader],
  BigIntReader: ['1n', BigIntReader],
  DecimalLiteralReader: ['123.45m', DecimalLiteralReader],
  NumericSeparatorReader: ['1_000', NumericSeparatorReader],
  ExponentReader: ['1e3', ExponentReader],
  NumberReader: ['123', NumberReader],
  StringReader: ['"a"', StringReader],
  RegexOrDivideReader: ['/re/', RegexOrDivideReader],
  PipelineOperatorReader: ['|>', PipelineOperatorReader],
  BindOperatorReader: ['::', BindOperatorReader],
  OperatorReader: ['+', OperatorReader],
  PunctuationReader: [';', PunctuationReader],
  TemplateStringReader: ['`a`', TemplateStringReader],
  JSXReader: ['<div></div>', JSXReader],
};

function bench(name, sample, reader, iterations = 1000) {
  const token = reader(new CharStream(sample), (t,v,s,e)=> new Token(t,v,s,e), { stateStack:['default'] });
  if (!token) throw new Error(`Reader ${name} failed on sample`);
  const start = performance.now();
  for (let i=0; i<iterations; i++) {
    reader(new CharStream(sample), (t,v,s,e)=>new Token(t,v,s,e), { stateStack:['default'] });
  }
  const sec = (performance.now()-start)/1000;
  const bytes = Buffer.byteLength(sample) * iterations;
  const mbps = bytes / (1024*1024) / sec;
  console.log(`${name}: ${mbps.toFixed(2)} MB/s`);
}

for (const [name, [sample, reader]] of Object.entries(readers)) {
  bench(name, sample, reader);
}
