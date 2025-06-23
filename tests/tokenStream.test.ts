// @ts-nocheck
import { test, expect } from '@jest/globals';
import { createTokenStream } from '../src/integration/TokenStream.js';
import { ASSIGNMENT_TYPES } from './utils/tokenTypeUtils.js';

test('token stream emits tokens sequentially', done => {
  const stream = createTokenStream('let x = 1;');
  const types = [];
  stream.on('data', t => types.push(t.type));
  stream.on('end', () => {
    expect(types).toEqual(ASSIGNMENT_TYPES);
    done();
  });
});
