import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ImportMetaReader } from "../../src/lexer/ImportMetaReader.js";

 test("ImportMetaReader reads import.meta", () => {
   const stream = new CharStream("import.meta");
   const tok = ImportMetaReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok.type).toBe("IMPORT_META");
   expect(tok.value).toBe("import.meta");
 });

 test("ImportMetaReader returns null when sequence mismatched", () => {
   const stream = new CharStream("import.met");
   const pos = stream.getPosition();
   const tok = ImportMetaReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok).toBeNull();
   expect(stream.getPosition()).toEqual(pos);
 });
