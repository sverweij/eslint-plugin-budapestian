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
    ecmaVersion: 2018,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["test/**/*.spec.js"],
      env: {
        mocha: true,
      },
    },
  ],
};
