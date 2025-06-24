import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RecordAndTupleReader } from "../../src/lexer/RecordAndTupleReader.js";

 test("RecordAndTupleReader reads tuple start", () => {
   const stream = new CharStream("#[");
   const tok = RecordAndTupleReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok.type).toBe("TUPLE_START");
   expect(tok.value).toBe("#[");
 });

 test("RecordAndTupleReader reads record start", () => {
   const stream = new CharStream("#{");
   const tok = RecordAndTupleReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok.type).toBe("RECORD_START");
   expect(tok.value).toBe("#{");
 });

 test("RecordAndTupleReader returns null when not matched", () => {
   const stream = new CharStream("#a");
   const pos = stream.getPosition();
   const tok = RecordAndTupleReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok).toBeNull();
   expect(stream.getPosition()).toEqual(pos);
 });
