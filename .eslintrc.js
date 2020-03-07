module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  plugins: ["unicorn"],
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  overrides: [
    {
      files: ["test/**/*.spec.js"],
      env: {
        mocha: true
      }
    }
  ]
};
