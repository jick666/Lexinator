export const ASSIGNMENT_TYPES = [
  'KEYWORD',
  'IDENTIFIER',
  'OPERATOR',
  'NUMBER',
  'PUNCTUATION'
];

export const PREFIX_TYPES = ASSIGNMENT_TYPES.slice(0, 3);
export const STRING_ASSIGN_TYPES = [...PREFIX_TYPES, 'STRING', 'PUNCTUATION'];
export const COMMENT_ASSIGN_TYPES = ['COMMENT', ...ASSIGNMENT_TYPES];

export function getTypes(tokens) {
  return tokens.map(t => t.type);
}
export function expectTypes(tokens, expected) {
  expect(getTypes(tokens)).toEqual(expected);
}
