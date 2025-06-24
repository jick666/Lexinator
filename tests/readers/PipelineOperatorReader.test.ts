import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { PipelineOperatorReader } from "../../src/lexer/PipelineOperatorReader.js";

 test("PipelineOperatorReader reads |> operator", () => {
   const stream = new CharStream("|>");
   const tok = PipelineOperatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok.type).toBe("PIPELINE_OPERATOR");
   expect(tok.value).toBe("|>");
 });

 test("PipelineOperatorReader returns null when sequence not matched", () => {
   const stream = new CharStream("=>");
   const pos = stream.getPosition();
   const tok = PipelineOperatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok).toBeNull();
   expect(stream.getPosition()).toEqual(pos);
 });
