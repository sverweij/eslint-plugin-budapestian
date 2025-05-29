import rule from "#rules/global-constant-pattern-rule.js";
import { RuleTester } from "eslint";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const ruleTesterTypeScriptParser = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

const ruleTesterDefaultParser = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

const GLOBAL_CONSTANT_CASES = {
  valid: [
    "const callExpression = require('some-module')",
    "const memberExpression= require('chai').expect",
    "const newExpression = new RegExp('houwoei')",
    "const newExpression = new Set()",
    "const arrowFunctionExpression = async () => {}; const callExpression = thing()",
    "const someFunction = () => 123",
    "const someFunction = function(){ return 123 }",

    "const LITERAL = 123",
    "const LITERAL = 123, ANOTHER_LITERAL = '456'",
    "const OBJECT_EXPRESSION = { one: 1, two: 2 }",
    "const ARRAY_EXPRESSION = ['aap', 'noot', 'mies']",
    "const OBJECT_EXPRESSION = {}",
    {
      code: "const π = 3.141592653589",
      options: [{ exceptions: ["π", "e"] }],
    },
  ],

  invalid: [
    {
      code: "const lowercase = 123",
      // output: "const LOWERCASE = 123",
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
    },
    {
      code: "const lowercase = 123",
      // output: "const LOWERCASE = 123",
      options: [{ exceptions: ["π", "e"] }],
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
    },
    {
      code: "const lowercase = 1 * 2 * 3",
      // output: "const LOWERCASE = 1 * 2 * 3",
      options: [{ exceptions: ["π", "e"] }],
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
    },
    {
      code: "const THING = 1; const lowercase = THING",
      // output: "const THING = 1; const LOWERCASE = THING",
      options: [{ exceptions: ["π", "e"] }],
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
    },
    {
      code: "const π = 3.141592653589",
      // output: "const Π = 3.141592653589",
      options: [{ exceptions: ["e"] }],
      errors: [
        {
          message: `global constant 'π' should be snaked upper case: 'Π'`,
          type: "Program",
        },
      ],
    },
    // multi const declaration
    {
      code: "const Uppercase = 123, lowercase = '456'",
      // output: "const UPPERCASE = 123, LOWERCASE = '456'",
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
    },
    // multiple const declarations
    {
      code: "const Uppercase = 123; const lowercase = '456'",
      // output: `const UPPERCASE = 123; const LOWERCASE = '456'`,
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
    },
    // Array expressions
    {
      code: "const arrayExpression = [123, '321']",
      // output: `const ARRAY_EXPRESSION = [123, '321']`,
      errors: [
        {
          message: `global constant 'arrayExpression' should be snaked upper case: 'ARRAY_EXPRESSION'`,
          type: "Program",
        },
      ],
    },
    // Object expressions
    {
      code: "const objectExpression = {}",
      // output: `const OBJECT_EXPRESSION = {}`,
      errors: [
        {
          message: `global constant 'objectExpression' should be snaked upper case: 'OBJECT_EXPRESSION'`,
          type: "Program",
        },
      ],
    },
    // properly decamlize and then snake case
    {
      code: "const camelCase = 123",
      // output: "const CAMEL_CASE = 123",
      errors: [
        {
          message: `global constant 'camelCase' should be snaked upper case: 'CAMEL_CASE'`,
          type: "Program",
        },
      ],
    },
    // when it looks like a local variable, but it is a global constant =>
    // strip the prefix before de-camelizing & uppering
    {
      code: "const lThisIsNotALocalVariable = 123",
      // output: "const THIS_IS_NOT_A_LOCAL_VARIABLE = 123",
      errors: [
        {
          message: `global constant 'lThisIsNotALocalVariable' should be snaked upper case: 'THIS_IS_NOT_A_LOCAL_VARIABLE'`,
          type: "Program",
        },
      ],
    },
    // when it looks like a global variable, but it is a global constant =>
    // strip the prefix before de-camelizing & uppering
    {
      code: "const gNotAGlobalVariable = 123",
      // output: "const NOT_A_GLOBAL_VARIABLE = 123",
      errors: [
        {
          message: `global constant 'gNotAGlobalVariable' should be snaked upper case: 'NOT_A_GLOBAL_VARIABLE'`,
          type: "Program",
        },
      ],
    },
    // when it looks like a parameter, but it is a global constant =>
    // strip the prefix before de-camelizing & uppering
    {
      code: "const pNotAParameter = 123",
      // output: "const NOT_A_PARAMETER = 123",
      errors: [
        {
          message: `global constant 'pNotAParameter' should be snaked upper case: 'NOT_A_PARAMETER'`,
          type: "Program",
        },
      ],
    },
    // global replace
    {
      code: "const lowercase = 123; function f (pBla) { return lowercase * pBla }",
      // output:
      //   "const LOWERCASE = 123; function f (pBla) { return LOWERCASE * pBla }",
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
    },
  ],
};

ruleTesterTypeScriptParser.run(
  "integration: global-constant-pattern - TypeScript parser",
  rule,
  GLOBAL_CONSTANT_CASES,
);

ruleTesterTypeScriptParser.run(
  "integration: global-constant-pattern - TypeScript specials - TypeScript parser",
  rule,
  {
    valid: ["type SomeType = string"],
    invalid: [],
  },
);

ruleTesterDefaultParser.run(
  "integration: global-constant-pattern - default parser",
  rule,
  GLOBAL_CONSTANT_CASES,
);

const GLOBAL_CONSTANT_UNICODE_CASES = {
  valid: [
    "const какойТоМодуль = require('some-module')",
    "const ВЕРХНИЙ_РЕГИСТР = 123",
    "const КОНСТАНТА = 123, КОНСТАНТА_УЛУЧШЕНИЕ = '456'",
  ],

  invalid: [
    {
      code: "const константаУлучшение = 123",
      // output: "const КОНСТАНТА_УЛУЧШЕНИЕ = 123",
      errors: [
        {
          message: `global constant 'константаУлучшение' should be snaked upper case: 'КОНСТАНТА_УЛУЧШЕНИЕ'`,
          type: "Program",
        },
      ],
    },
  ],
};

ruleTesterTypeScriptParser.run(
  "integration: global-constant-pattern - unicode edition - TypeScript parser",
  rule,
  GLOBAL_CONSTANT_UNICODE_CASES,
);

ruleTesterDefaultParser.run(
  "integration: global-constant-pattern - unicode edition - default parser",
  rule,
  GLOBAL_CONSTANT_UNICODE_CASES,
);

const GLOBAL_CONSTANT_EXPORT_PATTERN_CASES = {
  valid: ['export const MY_GLOBAL_CONSTANT = "something";'],

  invalid: [
    {
      code: 'export const myGlobalConstant = "something"; export const anOtherGlobalConst = "something else"',
      // output: 'const MY_GLOBAL_CONSTANT = "something"',
      errors: [
        {
          message: `global constant 'myGlobalConstant' should be snaked upper case: 'MY_GLOBAL_CONSTANT'`,
          type: "Program",
        },
        {
          message: `global constant 'anOtherGlobalConst' should be snaked upper case: 'AN_OTHER_GLOBAL_CONST'`,
          type: "Program",
        },
      ],
    },
  ],
};

ruleTesterTypeScriptParser.run(
  "integration: global-constant-pattern - export edition - TypeScript parser",
  rule,
  GLOBAL_CONSTANT_EXPORT_PATTERN_CASES,
);

ruleTesterDefaultParser.run(
  "integration: global-constant-pattern - export edition - default parser",
  rule,
  GLOBAL_CONSTANT_EXPORT_PATTERN_CASES,
);
