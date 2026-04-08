import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"

export default tseslint.config(
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["cypress/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": "warn",
    },
  },
  {
    // Chai assertions like .to.exist and .not.be.empty are property getters,
    // not function calls — ESLint incorrectly flags them as unused expressions.
    files: ["cypress/**/*.cy.ts"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    ignores: ["node_modules/", "cypress/reports/", "cypress/screenshots/", "cypress/videos/"],
  }
)
