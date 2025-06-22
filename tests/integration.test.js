import { tokenize } from "../src/index.js";
import { expectTypes } from "./utils/tokenTypeUtils.js";
import { integrationCases } from "./utils/integrationCases.js";

describe('integration tokenize', () => {
  test.each(integrationCases)('$desc', ({ src, types, noNull, valueIndex, value }) => {
    const toks = tokenize(src);
    if (noNull) {
      expect(toks).not.toContain(null);
    }
    expectTypes(toks, types);
    if (valueIndex !== undefined) {
      expect(toks[valueIndex].value).toBe(value);
    }
  });

  test('tokenize throws on unterminated template', () => {
    expect(() => tokenize('`oops')).toThrow();
  });
});
