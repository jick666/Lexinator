module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn",
    "semi": ["error", "always"],
    "indent": ["warn", 2],
    "no-trailing-spaces": "warn",
    "eol-last": ["warn", "always"],
    "no-multi-spaces": "warn",
    "no-multiple-empty-lines": ["warn", { "max": 1 }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "prefer-const": "off",
  },
};
