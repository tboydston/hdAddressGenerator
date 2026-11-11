const js = require("@eslint/js");
const globals = require("globals");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-plugin-prettier/recommended");

module.exports = [
  { ignores: ["node_modules/", "coverage/"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    files: ["tests/**/*.test.js"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      // Coin reference files only define the vectors a coin supports, so tests are registered conditionally.
      "jest/no-conditional-in-test": "off",
    },
  },
  prettier,
];
