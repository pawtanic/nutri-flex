import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      "indent": ["error", 2],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    }
  }
];
