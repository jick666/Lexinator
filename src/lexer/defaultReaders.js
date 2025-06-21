// src/lexer/defaultReaders.js

import { IdentifierReader } from './IdentifierReader.js';
import { BinaryReader } from './BinaryReader.js';
import { OctalReader } from './OctalReader.js';
import { HexReader } from './HexReader.js';
import { BigIntReader } from './BigIntReader.js';
import { DecimalLiteralReader } from './DecimalLiteralReader.js';
import { NumericSeparatorReader } from './NumericSeparatorReader.js';
import { ExponentReader } from './ExponentReader.js';
import { NumberReader } from './NumberReader.js';
import { StringReader } from './StringReader.js';
import { RegexOrDivideReader } from './RegexOrDivideReader.js';
import { BindOperatorReader } from './BindOperatorReader.js';
import { PipelineOperatorReader } from './PipelineOperatorReader.js';
import { OperatorReader } from './OperatorReader.js';
import { PunctuationReader } from './PunctuationReader.js';
import { TemplateStringReader } from './TemplateStringReader.js';
import { JSXReader } from './JSXReader.js';
import { CommentReader } from './CommentReader.js';
import { HTMLCommentReader } from './HTMLCommentReader.js';
import { SourceMappingURLReader } from './SourceMappingURLReader.js';
import { UnicodeWhitespaceReader } from './UnicodeWhitespaceReader.js';
import { ByteOrderMarkReader } from './ByteOrderMarkReader.js';
import { UnicodeIdentifierReader } from './UnicodeIdentifierReader.js';
import { UnicodeEscapeIdentifierReader } from './UnicodeEscapeIdentifierReader.js';
import { ShebangReader } from './ShebangReader.js';
import { DoExpressionReader } from './DoExpressionReader.js';
import { ModuleBlockReader } from './ModuleBlockReader.js';
import { UsingStatementReader } from './UsingStatementReader.js';
import { PatternMatchReader } from './PatternMatchReader.js';
import { PrivateIdentifierReader } from './PrivateIdentifierReader.js';
import { ImportAssertionReader } from './ImportAssertionReader.js';
import { RecordAndTupleReader } from './RecordAndTupleReader.js';
import { FunctionSentReader } from './FunctionSentReader.js';

/**
 * Ordered list of built-in lexer readers.
 * All entries are now *functions* conforming to the reader contract v2.
 */
export const baseReaders = [
  HTMLCommentReader,
  SourceMappingURLReader,
  CommentReader,
  UnicodeWhitespaceReader,
  ByteOrderMarkReader,
  ShebangReader,
  PrivateIdentifierReader,
  DoExpressionReader,
  ModuleBlockReader,
  UsingStatementReader,
  PatternMatchReader,
  FunctionSentReader,
  ImportAssertionReader,
  RecordAndTupleReader,
  IdentifierReader,
  UnicodeIdentifierReader,
  UnicodeEscapeIdentifierReader,
  HexReader,
  BinaryReader,
  OctalReader,
  BigIntReader,
  DecimalLiteralReader,
  NumericSeparatorReader,
  ExponentReader,
  NumberReader,
  StringReader,
  RegexOrDivideReader,
  PipelineOperatorReader,
  BindOperatorReader,
  OperatorReader,
  PunctuationReader,
  TemplateStringReader,
  JSXReader
];
