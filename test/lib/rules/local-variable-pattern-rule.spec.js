const rule = require("../../../lib/rules/local-variable-pattern-rule");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
});
ruleTester.run(
  "integration: local-variable-pattern - regular block scope variables",
  rule,
  {
    valid: [
      "{ let thing = require('thing') }",
      "{ let thing = require('thing').halikidee }",
      "{ let thing = new RegExp('thing') }",
      "function doSomething() { let lVariable }",
      "{ let lVariable }",
      "function doSomething() { if(true) {let lVariable} }",
      "function doSomething() { let lVariable = 123}",
      "function doSomething() { let lVariable, lSecondVariable, lThirdVariable = 123}",
      "{ const lVariable = 123}",
      "function doSomething() { const lVariable = 123}",
      "function doSomething() { const lVariable = 123, lSecondVariable = 456, lThirdVariable = 789}",
      "const GLOBAL_CONST = 1", // different rules for global consts
      "let gGlobalVariable = 'globally ok'", // ... and for global variables
    ],

    invalid: [
      // uninitialized
      {
        code: "{ let variable;}",
        output: "{ let lVariable;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      // initialized with a single literal value
      {
        code: "{ let variable = 481;}",
        output: "{ let lVariable = 481;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "{ const variable = 481;}",
        output: "{ const lVariable = 481;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      // initialized with an array
      {
        code: "{ let variable = ['this', 'is', 'an', 'array'];}",
        output: "{ let lVariable = ['this', 'is', 'an', 'array'];}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "{ const variable = ['this', 'is', 'an', 'array'];}",
        output: "{ const lVariable = ['this', 'is', 'an', 'array'];}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      // initialized with an object
      {
        code: "{ let variable = {};}",
        output: "{ let lVariable = {};}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "{ const variable = {};}",
        output: "{ const lVariable = {};}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      // initialized with an binary expression
      {
        code: "{ let variable = 1 + 1;}",
        output: "{ let lVariable = 1 + 1;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "{ const variable = 1 + 1;}",
        output: "{ const lVariable = 1 + 1;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      // initialized with a constant
      {
        code: "{ const lThing = 2; let variable = lThing;}",
        output: "{ const lThing = 2; let lVariable = lThing;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "{ const lThing = 2; const variable = lThing;}",
        output: "{ const lThing = 2; const lVariable = lThing;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      // smartly replace other budapestian prefixes
      {
        code: "{ let gVariable;}",
        output: "{ let lVariable;}",
        errors: [
          {
            message: `local variable 'gVariable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "{ const pVariable = 481;}",
        output: "{ const lVariable = 481;}",
        errors: [
          {
            message: `local variable 'pVariable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "function doSomething() { let variable;}",
        output: "function doSomething() { let lVariable;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
        ],
      },
      // multiple declaration
      {
        code: "{ let one, two, three = 123;}",
        output: "{ let lOne, lTwo, lThree = 123;}",
        errors: [
          {
            message: `local variable 'one' should be pascal case and start with a 'l': 'lOne'`,
            type: "BlockStatement",
          },
          {
            message: `local variable 'two' should be pascal case and start with a 'l': 'lTwo'`,
            type: "BlockStatement",
          },
          {
            message: `local variable 'three' should be pascal case and start with a 'l': 'lThree'`,
            type: "BlockStatement",
          },
        ],
      },
      // multiple declarations
      {
        code: "{ let one; let two; let three;}",
        output: "{ let lOne; let lTwo; let lThree;}",
        errors: [
          {
            message: `local variable 'one' should be pascal case and start with a 'l': 'lOne'`,
            type: "BlockStatement",
          },
          {
            message: `local variable 'two' should be pascal case and start with a 'l': 'lTwo'`,
            type: "BlockStatement",
          },
          {
            message: `local variable 'three' should be pascal case and start with a 'l': 'lThree'`,
            type: "BlockStatement",
          },
        ],
      },
      {
        code: "{ const one = 1; const two = 2; const three = 3;}",
        output: "{ const lOne = 1; const lTwo = 2; const lThree = 3;}",
        errors: [
          {
            message: `local variable 'one' should be pascal case and start with a 'l': 'lOne'`,
            type: "BlockStatement",
          },
          {
            message: `local variable 'two' should be pascal case and start with a 'l': 'lTwo'`,
            type: "BlockStatement",
          },
          {
            message: `local variable 'three' should be pascal case and start with a 'l': 'lThree'`,
            type: "BlockStatement",
          },
        ],
      },
      // leave variables outside the block scope alone
      {
        code: "let variable = '123'; function doSomething() { let variable = 123; for (let counter = 1; counter < 10; counter++) { variable += variable}; return variable;}",
        output:
          "let variable = '123'; function doSomething() { let lVariable = 123; for (let counter = 1; counter < 10; counter++) { lVariable += lVariable}; return lVariable;}",
        errors: [
          {
            message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
            type: "BlockStatement",
          },
          {
            message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
            type: "ForStatement",
          },
        ],
      },
    ],
  }
);

ruleTester.run("integration: local-variable-pattern - for statement", rule, {
  valid: [
    "for(let lCounter=0;lCounter<10;lCounter++){var i = lCounter + i}",
    "for(var counter=0;counter<10;counter++){var i = counter + i}",
  ],
  invalid: [
    {
      code: "for(let counter=0;counter<10;counter++){}",
      output: "for(let lCounter=0;lCounter<10;lCounter++){}",
      errors: [
        {
          message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
          type: "ForStatement",
        },
      ],
    },
    {
      code: "function f(){for(let counter=0;counter<10;counter++){var i = counter + i}}",
      output:
        "function f(){for(let lCounter=0;lCounter<10;lCounter++){var i = lCounter + i}}",
      errors: [
        {
          message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
          type: "ForStatement",
        },
      ],
    },
  ],
});

ruleTester.run("integration: local-variable-pattern - for-in statement", rule, {
  valid: ["for (let lCounter in [7,8,9]){var i = lCounter + i}"],
  invalid: [
    {
      code: "for(let counter in [7,8,9]){}",
      output: "for(let lCounter in [7,8,9]){}",
      errors: [
        {
          message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
          type: "ForInStatement",
        },
      ],
    },
    {
      code: "function f(){for(let counter in [7,8,9]){var i = counter + i}}",
      output:
        "function f(){for(let lCounter in [7,8,9]){var i = lCounter + i}}",
      errors: [
        {
          message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
          type: "ForInStatement",
        },
      ],
    },
  ],
});

ruleTester.run("integration: local-variable-pattern - for-of statement", rule, {
  valid: ["for (let lCounter of [7,8,9]){var i = lCounter + i}"],
  invalid: [
    {
      code: "for(let counter of [7,8,9]){}",
      output: "for(let lCounter of [7,8,9]){}",
      errors: [
        {
          message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
          type: "ForOfStatement",
        },
      ],
    },
    {
      code: "function f(){for(let counter of [7,8,9]){var i = counter + i}}",
      output:
        "function f(){for(let lCounter of [7,8,9]){var i = lCounter + i}}",
      errors: [
        {
          message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
          type: "ForOfStatement",
        },
      ],
    },
  ],
});

ruleTester.run("integration: local-variable-pattern - combo's", rule, {
  valid: [],
  // can't autofix overlapping ()
  invalid: [
    {
      code: "{let outer = 123; {let inner = 456; outer++}}",
      output: "{let lOuter = 123; {let inner = 456; lOuter++}}",
      errors: [
        {
          message: `local variable 'outer' should be pascal case and start with a 'l': 'lOuter'`,
          type: "BlockStatement",
        },
        {
          message: `local variable 'inner' should be pascal case and start with a 'l': 'lInner'`,
          type: "BlockStatement",
        },
      ],
    },
    {
      code: "{let first = 123; let second = 456; first++}",
      output: "{let lFirst = 123; let lSecond = 456; lFirst++}",
      errors: [
        {
          message: `local variable 'first' should be pascal case and start with a 'l': 'lFirst'`,
          type: "BlockStatement",
        },
        {
          message: `local variable 'second' should be pascal case and start with a 'l': 'lSecond'`,
          type: "BlockStatement",
        },
      ],
    },
    {
      code: "{let lOkido = 123; {let inner = 456; lOkido++}}",
      output: "{let lOkido = 123; {let lInner = 456; lOkido++}}",
      errors: [
        {
          message: `local variable 'inner' should be pascal case and start with a 'l': 'lInner'`,
          type: "BlockStatement",
        },
      ],
    },
    {
      code: "for(let value in [7,8,9]){};for(let index of [7,8,9]){};",
      output: "for(let lValue in [7,8,9]){};for(let lIndex of [7,8,9]){};",
      errors: [
        {
          message: `local variable 'value' should be pascal case and start with a 'l': 'lValue'`,
          type: "ForInStatement",
        },
        {
          message: `local variable 'index' should be pascal case and start with a 'l': 'lIndex'`,
          type: "ForOfStatement",
        },
      ],
    },
    {
      code: "let variable = '123'; function doSomething() { let variable = 123; for (let counter = 1; counter < 10; counter++) { variable += variable}; return variable;}",
      output:
        "let variable = '123'; function doSomething() { let lVariable = 123; for (let counter = 1; counter < 10; counter++) { lVariable += lVariable}; return lVariable;}",
      errors: [
        {
          message: `local variable 'variable' should be pascal case and start with a 'l': 'lVariable'`,
          type: "BlockStatement",
        },
        {
          message: `local variable 'counter' should be pascal case and start with a 'l': 'lCounter'`,
          type: "ForStatement",
        },
      ],
    },
    // overlapping, also with for loops cannot be wholly fixed
    {
      code: "for(let value in [7,8,9]){for(let index of [7,8,9]){}};",
      output: "for(let lValue in [7,8,9]){for(let index of [7,8,9]){}};",
      errors: [
        {
          message: `local variable 'value' should be pascal case and start with a 'l': 'lValue'`,
          type: "ForInStatement",
        },
        {
          message: `local variable 'index' should be pascal case and start with a 'l': 'lIndex'`,
          type: "ForOfStatement",
        },
      ],
    },
  ],
});

ruleTester.run("integration: local-variable-pattern - options", rule, {
  valid: [
    {
      code: "{ let x, y;}",
      options: [{ exceptions: ["x", "y"] }],
    },
    {
      code: "{ let x = 0, y = 0;}",
      options: [{ exceptions: ["x", "y"] }],
    },
    {
      code: "{ const x = -1;}",
      options: [{ exceptions: ["x", "y"] }],
    },
    {
      code: "{ const x = 0, y = 0;}",
      options: [{ exceptions: ["x", "y"] }],
    },
    {
      code: "for (let i = 0; i < 10; i++) { lala[i] = i * i; }",
      options: [{ exceptions: ["i", "j", "k"] }],
    },
    {
      code: "for (let v in [7,8,9]) { result *= v; }",
      options: [{ exceptions: ["v"] }],
    },
    {
      code: "for (let i of [7,8,9]) { lala[i] = i * i; }",
      options: [{ exceptions: ["i", "j", "k"] }],
    },
  ],
  invalid: [
    {
      code: "{ let isnot, allowed;}",
      output: "{ let lIsnot, lAllowed;}",
      options: [{ exceptions: ["x", "y"] }],
      errors: [
        {
          message: `local variable 'isnot' should be pascal case and start with a 'l': 'lIsnot'`,
          type: "BlockStatement",
        },
        {
          message: `local variable 'allowed' should be pascal case and start with a 'l': 'lAllowed'`,
          type: "BlockStatement",
        },
      ],
    },
    {
      code: "{ const isnot = 0;}",
      output: "{ const lIsnot = 0;}",
      options: [{ exceptions: ["x", "y"] }],
      errors: [
        {
          message: `local variable 'isnot' should be pascal case and start with a 'l': 'lIsnot'`,
          type: "BlockStatement",
        },
      ],
    },
    {
      code: "for (let count = 0; count < 10; count++) { lala[count] = count * count; }",
      output:
        "for (let lCount = 0; lCount < 10; lCount++) { lala[lCount] = lCount * lCount; }",
      options: [{ exceptions: ["i", "j", "k"] }],
      errors: [
        {
          message: `local variable 'count' should be pascal case and start with a 'l': 'lCount'`,
          type: "ForStatement",
        },
      ],
    },
  ],
});
