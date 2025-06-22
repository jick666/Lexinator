import { ImportCallReader } from '../../src/lexer/ImportCallReader.js';
import { CharStream } from '../../src/lexer/CharStream.js';
import { runReader, expectNull } from '../utils/readerTestUtils.js';

test('ImportCallReader reads import(', () => {
  const stream = new CharStream('import(');
  const { token } = runReader(ImportCallReader, undefined, undefined, stream);
  expect(token.type).toBe('IMPORT_CALL');
  expect(token.value).toBe('import');
  expect(stream.getPosition().index).toBe(6);
  expect(stream.current()).toBe('(');
});

test('ImportCallReader returns null when sequence mismatched', () => {
  const stream = new CharStream('import foo');
  expectNull(ImportCallReader, stream);
});
