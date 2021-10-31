const rule = require("../../../lib/rules/global-constant-pattern-rule");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

ruleTester.run("integration: global-constant-pattern", rule, {
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
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output: "const LOWERCASE = 123",
    },
    {
      code: "const lowercase = 123",
      options: [{ exceptions: ["π", "e"] }],
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output: "const LOWERCASE = 123",
    },
    {
      code: "const lowercase = 1 * 2 * 3",
      options: [{ exceptions: ["π", "e"] }],
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output: "const LOWERCASE = 1 * 2 * 3",
    },
    {
      code: "const THING = 1; const lowercase = THING",
      options: [{ exceptions: ["π", "e"] }],
      errors: [
        {
          message: `global constant 'lowercase' should be snaked upper case: 'LOWERCASE'`,
          type: "Program",
        },
      ],
      output: "const THING = 1; const LOWERCASE = THING",
    },
    {
      code: "const π = 3.141592653589",
      options: [{ exceptions: ["e"] }],
      errors: [
        {
          message: `global constant 'π' should be snaked upper case: 'Π'`,
          type: "Program",
        },
      ],
      output: "const Π = 3.141592653589",
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
    // Array expressions
    {
      code: "const arrayExpression = [123, '321']",
      errors: [
        {
          message: `global constant 'arrayExpression' should be snaked upper case: 'ARRAY_EXPRESSION'`,
          type: "Program",
        },
      ],
      output: `const ARRAY_EXPRESSION = [123, '321']`,
    },
    // Object expressions
    {
      code: "const objectExpression = {}",
      errors: [
        {
          message: `global constant 'objectExpression' should be snaked upper case: 'OBJECT_EXPRESSION'`,
          type: "Program",
        },
      ],
      output: `const OBJECT_EXPRESSION = {}`,
    },
    // properly decamlize and then snake case
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
    // when it looks like a local variable, but it is a global constant =>
    // strip the prefix before de-camelizing & uppering
    {
      code: "const lThisIsNotALocalVariable = 123",
      errors: [
        {
          message: `global constant 'lThisIsNotALocalVariable' should be snaked upper case: 'THIS_IS_NOT_A_LOCAL_VARIABLE'`,
          type: "Program",
        },
      ],
      output: "const THIS_IS_NOT_A_LOCAL_VARIABLE = 123",
    },
    // when it looks like a global variable, but it is a global constant =>
    // strip the prefix before de-camelizing & uppering
    {
      code: "const gNotAGlobalVariable = 123",
      errors: [
        {
          message: `global constant 'gNotAGlobalVariable' should be snaked upper case: 'NOT_A_GLOBAL_VARIABLE'`,
          type: "Program",
        },
      ],
      output: "const NOT_A_GLOBAL_VARIABLE = 123",
    },
    // when it looks like a parameter, but it is a global constant =>
    // strip the prefix before de-camelizing & uppering
    {
      code: "const pNotAParameter = 123",
      errors: [
        {
          message: `global constant 'pNotAParameter' should be snaked upper case: 'NOT_A_PARAMETER'`,
          type: "Program",
        },
      ],
      output: "const NOT_A_PARAMETER = 123",
    },
    // global replace
    {
      code: "const lowercase = 123; function f (pBla) { return lowercase * pBla }",
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
