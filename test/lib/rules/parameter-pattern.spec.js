const rule = require("../../../lib/rules/parameter-pattern");
const nodeVersionIsRecentEnough = require("../../../lib/utl/node-version-is-recent-enough");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018
  }
});
ruleTester.run("parameter-pattern", rule, {
  valid: [
    "function doSomething(pLalala) { }",
    "function doSomething() { }",
    "function f(pThing = 1234) { }",
    "function f(pThing = pX => pX) { }",
    "function f(_, pBladieBla) { }",
    "function f(_unused) { }",
    "const f = (pLalala) => { }",
    "const f = (pPiedPiper) => { }",
    "const f = (pThing = 1234) => { }",
    "const f = () => { }",
    "const f = (_Параметр) => { }"
  ],

  invalid: [
    {
      code: "function doSomething(lala) { }",
      errors: [
        {
          message: `parameter 'lala' should be pascal case and start with a p: 'pLala'`,
          type: "FunctionDeclaration"
        }
      ],
      output: "function doSomething(pLala) { }"
    },
    {
      code: "function doSomething(param) { const lLala = param }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a p: 'pParam'`,
          type: "FunctionDeclaration"
        }
      ],
      output: "function doSomething(pParam) { const lLala = pParam }"
    },
    {
      code: "const f = (lalala) => { }",
      errors: [
        {
          message: `parameter 'lalala' should be pascal case and start with a p: 'pLalala'`,
          type: "ArrowFunctionExpression"
        }
      ],
      output: "const f = (pLalala) => { }"
    },
    {
      code: "function f(thing = pX => pX) { }",
      errors: [
        {
          message: `parameter 'thing' should be pascal case and start with a p: 'pThing'`,
          type: "FunctionDeclaration"
        }
      ],
      output: "function f(pThing = pX => pX) { }"
    },
    {
      code: "function f(pThing = x => x) { }",
      errors: [
        {
          message: `parameter 'x' should be pascal case and start with a p: 'pX'`,
          type: "ArrowFunctionExpression"
        }
      ],
      output: "function f(pThing = pX => pX) { }"
    },
    {
      code: "const f = (piedpiper) => { }",
      errors: [
        {
          message: `parameter 'piedpiper' should be pascal case and start with a p: 'pPiedpiper'`,
          type: "ArrowFunctionExpression"
        }
      ],
      output: "const f = (pPiedpiper) => { }"
    },
    // only replace within own scope
    {
      code:
        "function otherFunction() {let param = 123} function doSomething(param) { const lSomeConst = param }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a p: 'pParam'`,
          type: "FunctionDeclaration"
        }
      ],
      output:
        "function otherFunction() {let param = 123} function doSomething(pParam) { const lSomeConst = pParam }"
    },
    // replace whole word only
    {
      code: "function doSomething(param) { const parameter = param }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a p: 'pParam'`,
          type: "FunctionDeclaration"
        }
      ],
      output: "function doSomething(pParam) { const parameter = pParam }"
    },
    {
      code: "function doSomething(param) { const lConst=param }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a p: 'pParam'`,
          type: "FunctionDeclaration"
        }
      ],
      output: "function doSomething(pParam) { const lConst=pParam }"
    },
    {
      code:
        "function doSomething(param, secondParam) { const lConst=param*secondParam }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a p: 'pParam'`,
          type: "FunctionDeclaration"
        },
        {
          message: `parameter 'secondParam' should be pascal case and start with a p: 'pSecondParam'`,
          type: "FunctionDeclaration"
        }
      ],
      output:
        "function doSomething(pParam, pSecondParam) { const lConst=pParam*pSecondParam }"
    },
    {
      code:
        "function doSomething(pParam, secondParam) { const lConst=pParam*secondParam }",
      errors: [
        {
          message: `parameter 'secondParam' should be pascal case and start with a p: 'pSecondParam'`,
          type: "FunctionDeclaration"
        }
      ],
      output:
        "function doSomething(pParam, pSecondParam) { const lConst=pParam*pSecondParam }"
    }
  ]
});

// unicode matching works properly from node >=10
if (nodeVersionIsRecentEnough()) {
  ruleTester.run("parameter-pattern unicode (node >= 10)", rule, {
    valid: [
      "function функция (pПараметр) { }",
      "const ф = (pПараметр) => { }"
      // "const ф = (p参数) => { }"
    ],

    invalid: [
      {
        code: "function doSomething(параметр) { const lLala = параметр }",
        errors: [
          {
            message: `parameter 'параметр' should be pascal case and start with a p: 'pПараметр'`,
            type: "FunctionDeclaration"
          }
        ],
        output: "function doSomething(pПараметр) { const lLala = pПараметр }"
      },
      {
        code: "const f = (функцияПараметр) => { }",
        errors: [
          {
            message: `parameter 'функцияПараметр' should be pascal case and start with a p: 'pФункцияПараметр'`,
            type: "ArrowFunctionExpression"
          }
        ],
        output: "const f = (pФункцияПараметр) => { }"
      },
      // replace snakes
      {
        code: "const f = (function_parameter) => { }",
        errors: [
          {
            message: `parameter 'function_parameter' should be pascal case and start with a p: 'pFunctionParameter'`,
            type: "ArrowFunctionExpression"
          }
        ],
        output: "const f = (pFunctionParameter) => { }"
      },
      {
        code: "const f = (функция_параметр) => { }",
        errors: [
          {
            message: `parameter 'функция_параметр' should be pascal case and start with a p: 'pФункцияПараметр'`,
            type: "ArrowFunctionExpression"
          }
        ],
        output: "const f = (pФункцияПараметр) => { }"
      },
      {
        code: "const f = (ФУНКЦИЯ_ПАРАМЕТР) => { }",
        errors: [
          {
            message: `parameter 'ФУНКЦИЯ_ПАРАМЕТР' should be pascal case and start with a p: 'pФункцияПараметр'`,
            type: "ArrowFunctionExpression"
          }
        ],
        output: "const f = (pФункцияПараметр) => { }"
      },
      // only replace within own scope
      {
        code:
          "function otherFunction() {let парам = 123} function doSomething(парам) { const lSomeConst = парам }",
        errors: [
          {
            message: `parameter 'парам' should be pascal case and start with a p: 'pПарам'`,
            type: "FunctionDeclaration"
          }
        ],
        output:
          "function otherFunction() {let парам = 123} function doSomething(pПарам) { const lSomeConst = pПарам }"
      },
      // replace whole word only
      {
        code: "function doSomething(парам) { const параметр=парам }",
        errors: [
          {
            message: `parameter 'парам' should be pascal case and start with a p: 'pПарам'`,
            type: "FunctionDeclaration"
          }
        ],
        output: "function doSomething(pПарам) { const параметр=pПарам }"
      }
    ]
  });
}
