import { createTokenStream } from '../src/integration/TokenStream.js';

test('token stream emits tokens sequentially', done => {
  const stream = createTokenStream('let x = 1;');
  const types = [];
  stream.on('data', t => types.push(t.type));
  stream.on('end', () => {
    expect(types).toEqual([
      'KEYWORD',
      'IDENTIFIER',
      'OPERATOR',
      'NUMBER',
      'PUNCTUATION'
    ]);
    done();
  });
});
