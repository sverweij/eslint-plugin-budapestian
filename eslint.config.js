import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import budapestian from "./lib/index.js";
import globals from "globals";

export default [
  // Base configuration for all files
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es6,
      },
    },
  },

  // ESLint recommended rules
  js.configs.recommended,

  // ESLint plugin rules for all files
  {
    plugins: {
      "eslint-plugin": eslintPlugin,
      budapestian,
    },
    rules: {
      ...eslintPlugin.configs.all.rules,
      ...budapestian.configs.recommended.rules,
      "node/no-unsupported-features/es-syntax": "off",
    },
  },

  // Prettier config (disables conflicting rules)
  prettier,

  // Specific configuration for test files
  {
    files: ["test/**/*.spec.mjs"],
    rules: {
      // Add any test-specific rules here if needed
    },
  },
];
