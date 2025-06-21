// JavaScript grammar definitions
const keywords = [
  "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete",
  "do", "else", "export", "extends", "finally", "for", "function", "if", "import",
  "in", "instanceof", "let",
  "new", "return", "super", "switch", "this", "throw", "try", "typeof", "var", "void",
  "while", "with", "yield"
];

const operators = [
  "?.", "??", "??=", "|>",
  "+", "-", "*", "/", "%", "++", "--", "=", "+=", "-=", "*=", "**", "/=", "%=", "**=", "==", "===", "!=", "!==",
  "&&=", "||=",
  ">", "<", ">=", "<=", "&&", "||", "!", "?", "...", "=>"
];

const punctuation = ["{", "}", "(", ")", "[", "]", ".", ";", ","];

export const JavaScriptGrammar = {
  keywords,
  keywordSet: new Set(keywords),
  operators,
  sortedOperators: operators.slice().sort((a, b) => b.length - a.length),
  punctuation,
  punctuationSet: new Set(punctuation)
};
