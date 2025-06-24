module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  plugins: [],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
    "semi": ["error", "always"],
    "indent": ["warn", 2],
    "no-trailing-spaces": "warn",
    "eol-last": ["warn", "always"],
    "no-multi-spaces": "warn",
    "no-multiple-empty-lines": ["warn", { "max": 1 }],
  },
};
