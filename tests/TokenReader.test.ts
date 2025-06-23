// @ts-nocheck
import { jest, test, expect } from "@jest/globals";
import { CharStream } from '../src/lexer/CharStream.js';
import { runReader } from '../src/lexer/TokenReader.js';

test('runReader invokes reader with stream and factory', () => {
  const stream = new CharStream('a');
  const fakeReader = jest.fn((str, factory) => factory('ID', 'a', {index:0}, {index:1}));
  const result = runReader(fakeReader, stream, (t,v,s,e) => ({type:t,value:v,start:s,end:e}));
  expect(fakeReader).toHaveBeenCalledWith(stream, expect.any(Function), undefined);
  expect(result).toEqual({type:'ID',value:'a',start:{index:0},end:{index:1}});
});

test('runReader forwards engine argument', () => {
  const stream = new CharStream('a');
  const engine = {};
  const fakeReader = jest.fn(() => null);
  runReader(fakeReader, stream, () => {}, engine);
  expect(fakeReader).toHaveBeenCalledWith(stream, expect.any(Function), engine);
});

test('runReader throws when reader is not function', () => {
  expect(() => runReader(null, new CharStream(''), () => {})).toThrow(TypeError);
});
