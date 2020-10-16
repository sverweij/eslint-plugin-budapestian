const rule = require("../../../lib/rules/local-variable-pattern");
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
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ let lVariable;}",
      },
      // initialized with a single literal value
      {
        code: "{ let variable = 481;}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ let lVariable = 481;}",
      },
      {
        code: "{ const variable = 481;}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ const lVariable = 481;}",
      },
      // initialized with an array
      {
        code: "{ let variable = ['this', 'is', 'an', 'array'];}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ let lVariable = ['this', 'is', 'an', 'array'];}",
      },
      {
        code: "{ const variable = ['this', 'is', 'an', 'array'];}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ const lVariable = ['this', 'is', 'an', 'array'];}",
      },
      // initialized with an object
      {
        code: "{ let variable = {};}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ let lVariable = {};}",
      },
      {
        code: "{ const variable = {};}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ const lVariable = {};}",
      },
      // smartly replace other budapestian prefixes
      {
        code: "{ let gVariable;}",
        errors: [
          {
            message: `variable 'gVariable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ let lVariable;}",
      },
      {
        code: "{ const pVariable = 481;}",
        errors: [
          {
            message: `variable 'pVariable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "{ const lVariable = 481;}",
      },
      {
        code: "function doSomething() { let variable;}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
        ],
        output: "function doSomething() { let lVariable;}",
      },
      // multiple declaration
      {
        code: "{ let one, two, three = 123;}",
        errors: [
          {
            message: `variable 'one' should be pascal case and start with an l: 'lOne'`,
            type: "BlockStatement",
          },
          {
            message: `variable 'two' should be pascal case and start with an l: 'lTwo'`,
            type: "BlockStatement",
          },
          {
            message: `variable 'three' should be pascal case and start with an l: 'lThree'`,
            type: "BlockStatement",
          },
        ],
        output: "{ let lOne, lTwo, lThree = 123;}",
      },
      // multiple declarations
      {
        code: "{ let one; let two; let three;}",
        errors: [
          {
            message: `variable 'one' should be pascal case and start with an l: 'lOne'`,
            type: "BlockStatement",
          },
          {
            message: `variable 'two' should be pascal case and start with an l: 'lTwo'`,
            type: "BlockStatement",
          },
          {
            message: `variable 'three' should be pascal case and start with an l: 'lThree'`,
            type: "BlockStatement",
          },
        ],
        output: "{ let lOne; let lTwo; let lThree;}",
      },
      {
        code: "{ const one = 1; const two = 2; const three = 3;}",
        errors: [
          {
            message: `variable 'one' should be pascal case and start with an l: 'lOne'`,
            type: "BlockStatement",
          },
          {
            message: `variable 'two' should be pascal case and start with an l: 'lTwo'`,
            type: "BlockStatement",
          },
          {
            message: `variable 'three' should be pascal case and start with an l: 'lThree'`,
            type: "BlockStatement",
          },
        ],
        output: "{ const lOne = 1; const lTwo = 2; const lThree = 3;}",
      },
      // leave variables outside the block scope alone
      {
        code:
          "let variable = '123'; function doSomething() { let variable = 123; for (let counter = 1; counter < 10; counter++) { variable += variable}; return variable;}",
        errors: [
          {
            message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
            type: "BlockStatement",
          },
          {
            message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
            type: "ForStatement",
          },
        ],
        output:
          "let variable = '123'; function doSomething() { let lVariable = 123; for (let counter = 1; counter < 10; counter++) { lVariable += lVariable}; return lVariable;}",
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
      errors: [
        {
          message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
          type: "ForStatement",
        },
      ],
      output: "for(let lCounter=0;lCounter<10;lCounter++){}",
    },
    {
      code:
        "function f(){for(let counter=0;counter<10;counter++){var i = counter + i}}",
      errors: [
        {
          message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
          type: "ForStatement",
        },
      ],
      output:
        "function f(){for(let lCounter=0;lCounter<10;lCounter++){var i = lCounter + i}}",
    },
  ],
});

ruleTester.run("integration: local-variable-pattern - for-in statement", rule, {
  valid: ["for (let lCounter in [7,8,9]){var i = lCounter + i}"],
  invalid: [
    {
      code: "for(let counter in [7,8,9]){}",
      errors: [
        {
          message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
          type: "ForInStatement",
        },
      ],
      output: "for(let lCounter in [7,8,9]){}",
    },
    {
      code: "function f(){for(let counter in [7,8,9]){var i = counter + i}}",
      errors: [
        {
          message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
          type: "ForInStatement",
        },
      ],
      output:
        "function f(){for(let lCounter in [7,8,9]){var i = lCounter + i}}",
    },
  ],
});

ruleTester.run("integration: local-variable-pattern - for-of statement", rule, {
  valid: ["for (let lCounter of [7,8,9]){var i = lCounter + i}"],
  invalid: [
    {
      code: "for(let counter of [7,8,9]){}",
      errors: [
        {
          message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
          type: "ForOfStatement",
        },
      ],
      output: "for(let lCounter of [7,8,9]){}",
    },
    {
      code: "function f(){for(let counter of [7,8,9]){var i = counter + i}}",
      errors: [
        {
          message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
          type: "ForOfStatement",
        },
      ],
      output:
        "function f(){for(let lCounter of [7,8,9]){var i = lCounter + i}}",
    },
  ],
});

ruleTester.run("integration: local-variable-pattern - combo's", rule, {
  valid: [],
  // can't autofix overlapping ()
  invalid: [
    {
      code: "{let outer = 123; {let inner = 456; outer++}}",
      errors: [
        {
          message: `variable 'outer' should be pascal case and start with an l: 'lOuter'`,
          type: "BlockStatement",
        },
        {
          message: `variable 'inner' should be pascal case and start with an l: 'lInner'`,
          type: "BlockStatement",
        },
      ],
      output: "{let lOuter = 123; {let inner = 456; lOuter++}}",
    },
    {
      code: "{let first = 123; let second = 456; first++}",
      errors: [
        {
          message: `variable 'first' should be pascal case and start with an l: 'lFirst'`,
          type: "BlockStatement",
        },
        {
          message: `variable 'second' should be pascal case and start with an l: 'lSecond'`,
          type: "BlockStatement",
        },
      ],
      output: "{let lFirst = 123; let lSecond = 456; lFirst++}",
    },
    {
      code: "{let lOkido = 123; {let inner = 456; lOkido++}}",
      errors: [
        {
          message: `variable 'inner' should be pascal case and start with an l: 'lInner'`,
          type: "BlockStatement",
        },
      ],
      output: "{let lOkido = 123; {let lInner = 456; lOkido++}}",
    },
    {
      code: "for(let value in [7,8,9]){};for(let index of [7,8,9]){};",
      errors: [
        {
          message: `variable 'value' should be pascal case and start with an l: 'lValue'`,
          type: "ForInStatement",
        },
        {
          message: `variable 'index' should be pascal case and start with an l: 'lIndex'`,
          type: "ForOfStatement",
        },
      ],
      output: "for(let lValue in [7,8,9]){};for(let lIndex of [7,8,9]){};",
    },
    {
      code:
        "let variable = '123'; function doSomething() { let variable = 123; for (let counter = 1; counter < 10; counter++) { variable += variable}; return variable;}",
      errors: [
        {
          message: `variable 'variable' should be pascal case and start with an l: 'lVariable'`,
          type: "BlockStatement",
        },
        {
          message: `variable 'counter' should be pascal case and start with an l: 'lCounter'`,
          type: "ForStatement",
        },
      ],
      output:
        "let variable = '123'; function doSomething() { let lVariable = 123; for (let counter = 1; counter < 10; counter++) { lVariable += lVariable}; return lVariable;}",
    },
    // overlapping, also with for loops cannot be wholly fixed
    {
      code: "for(let value in [7,8,9]){for(let index of [7,8,9]){}};",
      errors: [
        {
          message: `variable 'value' should be pascal case and start with an l: 'lValue'`,
          type: "ForInStatement",
        },
        {
          message: `variable 'index' should be pascal case and start with an l: 'lIndex'`,
          type: "ForOfStatement",
        },
      ],
      output: "for(let lValue in [7,8,9]){for(let index of [7,8,9]){}};",
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
      options: [{ exceptions: ["x", "y"] }],
      errors: [
        {
          message: `variable 'isnot' should be pascal case and start with an l: 'lIsnot'`,
          type: "BlockStatement",
        },
        {
          message: `variable 'allowed' should be pascal case and start with an l: 'lAllowed'`,
          type: "BlockStatement",
        },
      ],
      output: "{ let lIsnot, lAllowed;}",
    },
    {
      code: "{ const isnot = 0;}",
      options: [{ exceptions: ["x", "y"] }],
      errors: [
        {
          message: `variable 'isnot' should be pascal case and start with an l: 'lIsnot'`,
          type: "BlockStatement",
        },
      ],
      output: "{ const lIsnot = 0;}",
    },
    {
      code:
        "for (let count = 0; count < 10; count++) { lala[count] = count * count; }",
      options: [{ exceptions: ["i", "j", "k"] }],
      errors: [
        {
          message: `variable 'count' should be pascal case and start with an l: 'lCount'`,
          type: "ForStatement",
        },
      ],
      output:
        "for (let lCount = 0; lCount < 10; lCount++) { lala[lCount] = lCount * lCount; }",
    },
  ],
});
