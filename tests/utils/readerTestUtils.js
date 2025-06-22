import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";

export function runReader(reader, src, engine, stream) {
  const str = stream || new CharStream(src);
  const token = reader(str, (t, v, s, e) => new Token(t, v, s, e), engine);
  return { token, stream: str };
}

