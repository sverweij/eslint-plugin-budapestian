module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:eslint-plugin/all",
    "plugin:budapestian/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "node/no-unsupported-features/es-syntax": "off",
  },
  overrides: [
    {
      files: ["test/**/*.spec.mjs"],
      env: {
        mocha: true,
      },
    },
  ],
};
