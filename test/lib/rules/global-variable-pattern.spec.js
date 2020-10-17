const rule = require("../../../lib/rules/global-variable-pattern");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
});
ruleTester.run("integration: global-variable-pattern", rule, {
  valid: [
    "let someModule = require('some-module')",
    "let gGlobalVariable;",
    "let gCapitals = 123",
    "let gCapitals = 123, gMoreCapitals = '456'",
    "let gThing2SomeOtherThing = { one: 1, two: 2 }",
    "let gAnArray = ['aap', 'noot', 'mies']",
    "{let lScopedVariable = 'yo'}",
    "function doStuff() { if (true) { let someVariable = 789; return someVariable;} }",
    "var someModule = require('some-module')",
    "var gGlobalVariable;",
    "var gCapitals = 123",
    "var gCapitals = 123, gMoreCapitals = '456'",
    "var gThing2SomeOtherThing = { one: 1, two: 2 }",
    "var gAnArray = ['aap', 'noot', 'mies']",
    {
      code: "let actually_allowed;",
      options: [{ exceptions: ["actually_allowed"] }],
    },
    {
      code: "var actually_allowed = 21;",
      options: [{ exceptions: ["actually_allowed"] }],
    },
  ],

  invalid: [
    {
      code: "let lowercase = 123",
      errors: [
        {
          message: `global variable 'lowercase' should be pascal case and start with a g: 'gLowercase'`,
          type: "Program",
        },
      ],
      output: "let gLowercase = 123",
    },
    {
      code: "var lowercase = 123",
      errors: [
        {
          message: `global variable 'lowercase' should be pascal case and start with a g: 'gLowercase'`,
          type: "Program",
        },
      ],
      output: "var gLowercase = 123",
    },
    // multi variable declarations
    {
      code: "let Uppercase = 123, lowercase = '456'",
      errors: [
        {
          message: `global variable 'Uppercase' should be pascal case and start with a g: 'gUppercase'`,
          type: "Program",
        },
        {
          message: `global variable 'lowercase' should be pascal case and start with a g: 'gLowercase'`,
          type: "Program",
        },
      ],
      output: "let gUppercase = 123, gLowercase = '456'",
    },
    {
      code: "var Uppercase = 123, lowercase = '456'",
      errors: [
        {
          message: `global variable 'Uppercase' should be pascal case and start with a g: 'gUppercase'`,
          type: "Program",
        },
        {
          message: `global variable 'lowercase' should be pascal case and start with a g: 'gLowercase'`,
          type: "Program",
        },
      ],
      output: "var gUppercase = 123, gLowercase = '456'",
    },
    // multiple variable declarations
    {
      code: "let Uppercase = 123; let lowercase = '456'",
      errors: [
        {
          message: `global variable 'Uppercase' should be pascal case and start with a g: 'gUppercase'`,
          type: "Program",
        },
        {
          message: `global variable 'lowercase' should be pascal case and start with a g: 'gLowercase'`,
          type: "Program",
        },
      ],
      output: "let gUppercase = 123; let gLowercase = '456'",
    },
    {
      code: "var Uppercase = 123; var lowercase = '456'",
      errors: [
        {
          message: `global variable 'Uppercase' should be pascal case and start with a g: 'gUppercase'`,
          type: "Program",
        },
        {
          message: `global variable 'lowercase' should be pascal case and start with a g: 'gLowercase'`,
          type: "Program",
        },
      ],
      output: "var gUppercase = 123; var gLowercase = '456'",
    },
    // upper snake case handling
    {
      code: "let SNAKE_CASE = 123",
      errors: [
        {
          message: `global variable 'SNAKE_CASE' should be pascal case and start with a g: 'gSnakeCase'`,
          type: "Program",
        },
      ],
      output: "let gSnakeCase = 123",
    },
    {
      code: "var SNAKE_CASE = 123",
      errors: [
        {
          message: `global variable 'SNAKE_CASE' should be pascal case and start with a g: 'gSnakeCase'`,
          type: "Program",
        },
      ],
      output: "var gSnakeCase = 123",
    },
    // if it looks like a local variable, but it's global => just replace the prefix
    {
      code: "let lThisIsAGlobal = 123",
      errors: [
        {
          message: `global variable 'lThisIsAGlobal' should be pascal case and start with a g: 'gThisIsAGlobal'`,
          type: "Program",
        },
      ],
      output: "let gThisIsAGlobal = 123",
    },
    {
      code: "var lThisIsAGlobal = 123",
      errors: [
        {
          message: `global variable 'lThisIsAGlobal' should be pascal case and start with a g: 'gThisIsAGlobal'`,
          type: "Program",
        },
      ],
      output: "var gThisIsAGlobal = 123",
    },
    // if it looks like a parameter, but it's global => just replace the prefix
    {
      code: "let pThisIsAGlobal = 123",
      errors: [
        {
          message: `global variable 'pThisIsAGlobal' should be pascal case and start with a g: 'gThisIsAGlobal'`,
          type: "Program",
        },
      ],
      output: "let gThisIsAGlobal = 123",
    },
    {
      code: "var pThisIsAGlobal = 123",
      errors: [
        {
          message: `global variable 'pThisIsAGlobal' should be pascal case and start with a g: 'gThisIsAGlobal'`,
          type: "Program",
        },
      ],
      output: "var gThisIsAGlobal = 123",
    },
    // global replace
    {
      code:
        "let SOMETHING_SOMETHING = 123; function f (pBla) { return SOMETHING_SOMETHING * pBla }",
      errors: [
        {
          message: `global variable 'SOMETHING_SOMETHING' should be pascal case and start with a g: 'gSomethingSomething'`,
          type: "Program",
        },
      ],
      output:
        "let gSomethingSomething = 123; function f (pBla) { return gSomethingSomething * pBla }",
    },
    {
      code:
        "var SOMETHING_SOMETHING = 123; function f (pBla) { return SOMETHING_SOMETHING * pBla }",
      options: [{ exceptions: ["allowed_but_not_used_in_this_test"] }],
      errors: [
        {
          message: `global variable 'SOMETHING_SOMETHING' should be pascal case and start with a g: 'gSomethingSomething'`,
          type: "Program",
        },
      ],
      output:
        "var gSomethingSomething = 123; function f (pBla) { return gSomethingSomething * pBla }",
    },
  ],
});

ruleTester.run("integration: global-constant-pattern - unicode edition", rule, {
  valid: [
    "let какойТоМодуль = require('some-module')",
    "let gПаскальКейс = 123",
    "let gПаскальКейс = 123, gПодробнееОПаскале = '456'",
    "var какойТоМодуль = require('some-module')",
    "var gПаскальКейс = 123",
    "var gПаскальКейс = 123, gПодробнееОПаскале = '456'",
  ],

  invalid: [
    {
      code: "let ПЕРЕМЕННАЯ_ПЕРЕДАЧА = 123",
      errors: [
        {
          message: `global variable 'ПЕРЕМЕННАЯ_ПЕРЕДАЧА' should be pascal case and start with a g: 'gПеременнаяПередача'`,
          type: "Program",
        },
      ],
      output: "let gПеременнаяПередача = 123",
    },
    {
      code: "var ПЕРЕМЕННАЯ_ПЕРЕДАЧА = 123",
      errors: [
        {
          message: `global variable 'ПЕРЕМЕННАЯ_ПЕРЕДАЧА' should be pascal case and start with a g: 'gПеременнаяПередача'`,
          type: "Program",
        },
      ],
      output: "var gПеременнаяПередача = 123",
    },
  ],
});
