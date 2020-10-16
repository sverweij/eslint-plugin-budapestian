module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  plugins: ["unicorn", "local-budapestian"],
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "local-budapestian/parameter-pattern": "error",
    "local-budapestian/local-variable-pattern": [
      "error",
      { exceptions: ["i", "j", "k"] },
    ],
    "local-budapestian/global-variable-pattern": "error",
    "local-budapestian/global-constant-pattern": "error",
  },
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
