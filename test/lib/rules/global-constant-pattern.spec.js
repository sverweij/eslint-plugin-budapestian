const rule = require("../../../lib/rules/global-constant-pattern");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
});
ruleTester.run("integration: global-constant-pattern", rule, {
  valid: [
    "const someModule = require('some-module')",
    "const CAPITALS = 123",
    "const CAPITALS = 123, MORE_CAPITALS = '456'",
    "const THING2SOME_OTHER_THING = { one: 1, two: 2 }",
    "const AN_ARRAY = ['aap', 'noot', 'mies']",
  ],

  invalid: [
    {
      code: "const lowercase = 123",
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output: "const LOWERCASE = 123",
    },
    // multi const declaration
    {
      code: "const Uppercase = 123, lowercase = '456'",
      errors: [
        {
          message: `global constant 'Uppercase' should be snaked upper case: 'UPPERCASE'`,
          type: "Program",
        },
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output: "const UPPERCASE = 123, LOWERCASE = '456'",
    },
    // multiple const declarations
    {
      code: "const Uppercase = 123; const lowercase = '456'",
      errors: [
        {
          message: `global constant 'Uppercase' should be snaked upper case: 'UPPERCASE'`,
          type: "Program",
        },
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output: `const UPPERCASE = 123; const LOWERCASE = '456'`,
    },
    // global replace
    {
      code: "const camelCase = 123",
      errors: [
        {
          message: `global constant 'camelCase' should be snaked upper case: 'CAMEL_CASE'`,
          type: "Program",
        },
      ],
      output: "const CAMEL_CASE = 123",
    },
    // global replace
    {
      code:
        "const lowercase = 123; function f (pBla) { return lowercase * pBla }",
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output:
        "const LOWERCASE = 123; function f (pBla) { return LOWERCASE * pBla }",
    },
  ],
});

ruleTester.run("integration: global-constant-pattern - unicode edition", rule, {
  valid: [
    "const какойТоМодуль = require('some-module')",
    "const ВЕРХНИЙ_РЕГИСТР = 123",
    "const КОНСТАНТА = 123, КОНСТАНТА_УЛУЧШЕНИЕ = '456'",
  ],

  invalid: [
    {
      code: "const константаУлучшение = 123",
      errors: [
        {
          message: `global constant 'константаУлучшение' should be snaked upper case: 'КОНСТАНТА_УЛУЧШЕНИЕ'`,
          type: "Program",
        },
      ],
      output: "const КОНСТАНТА_УЛУЧШЕНИЕ = 123",
    },
  ],
});
