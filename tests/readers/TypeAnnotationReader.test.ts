// @ts-nocheck
import { test, expect } from '@jest/globals';
import { createTypeAnnotationReader } from '../../src/plugins/common/TypeAnnotationReader.js';
import { expectToken, expectNull } from '../utils/readerTestUtils.js';

test('TypeAnnotationReader stops at newline', () => {
  const reader = createTypeAnnotationReader();
  expectToken(reader, ': string\nnext', 'TYPE_ANNOTATION', ': string', 8);
});

test('TypeAnnotationReader allows question marks when option set', () => {
  const reader = createTypeAnnotationReader({ allowQuestionMark: true });
  expectToken(reader, ': ?number', 'TYPE_ANNOTATION', ': ?number', 9);
});

test('TypeAnnotationReader returns null when not at colon', () => {
  const reader = createTypeAnnotationReader();
  expectNull(reader, 'a');
});
