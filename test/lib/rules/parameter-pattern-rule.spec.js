import rule from "#rules/parameter-pattern-rule.js";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";

const ruleTesterTypeScriptParser = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

const ruleTesterDefaultParser = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
});

const PARAMETER_PATTERN_CASES = {
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
    "const f = (_Параметр) => { }",
    {
      code: "function doSomething(pThing, EKSEPTION) {}",
      options: [{ exceptions: ["EKSEPTION"] }],
    },
    {
      code: "const f = (pThing, EKSEPTION) => {}",
      options: [{ exceptions: ["EKSEPTION"] }],
    },
  ],

  invalid: [
    {
      code: "function doSomething(lala) { }",
      output: "function doSomething(pLala) { }",
      errors: [
        {
          message: `parameter 'lala' should be pascal case and start with a 'p': 'pLala'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "function doSomething(param) { const lLala = param }",
      output: "function doSomething(pParam) { const lLala = pParam }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "const f = (lalala) => { }",
      output: "const f = (pLalala) => { }",
      errors: [
        {
          message: `parameter 'lalala' should be pascal case and start with a 'p': 'pLalala'`,
          type: "ArrowFunctionExpression",
        },
      ],
    },
    {
      code: "function f(thing = pX => pX) { }",
      output: "function f(pThing = pX => pX) { }",
      errors: [
        {
          message: `parameter 'thing' should be pascal case and start with a 'p': 'pThing'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "function f(pThing = x => x) { }",
      output: "function f(pThing = pX => pX) { }",
      errors: [
        {
          message: `parameter 'x' should be pascal case and start with a 'p': 'pX'`,
          type: "ArrowFunctionExpression",
        },
      ],
    },
    {
      code: "const f = (piedpiper) => { }",
      output: "const f = (pPiedpiper) => { }",
      errors: [
        {
          message: `parameter 'piedpiper' should be pascal case and start with a 'p': 'pPiedpiper'`,
          type: "ArrowFunctionExpression",
        },
      ],
    },
    // only replace within own scope
    {
      code: "function otherFunction() {let param = 123} function doSomething(param) { const lSomeConst = param }",
      output:
        "function otherFunction() {let param = 123} function doSomething(pParam) { const lSomeConst = pParam }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    // replace whole word only
    {
      code: "function doSomething(param) { const parameter = param }",
      output: "function doSomething(pParam) { const parameter = pParam }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "function doSomething(param) { const lConst=param }",
      output: "function doSomething(pParam) { const lConst=pParam }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "function doSomething(param, secondParam) { const lConst=param*secondParam }",
      output:
        "function doSomething(pParam, pSecondParam) { const lConst=pParam*pSecondParam }",
      errors: [
        {
          message: `parameter 'param' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
        {
          message: `parameter 'secondParam' should be pascal case and start with a 'p': 'pSecondParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "function doSomething(pParam, secondParam) { const lConst=pParam*secondParam }",
      output:
        "function doSomething(pParam, pSecondParam) { const lConst=pParam*pSecondParam }",
      errors: [
        {
          message: `parameter 'secondParam' should be pascal case and start with a 'p': 'pSecondParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    // if it's either a local or global variable pattern, just replace
    // the prefix instead of blindly plonking a p in front of it
    {
      code: "function doSomething(lParam) { const lConst=lParam*3 }",
      output: "function doSomething(pParam) { const lConst=pParam*3 }",
      errors: [
        {
          message: `parameter 'lParam' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "function doSomething(gParam) { const lConst=gParam*3 }",
      output: "function doSomething(pParam) { const lConst=pParam*3 }",
      errors: [
        {
          message: `parameter 'gParam' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    //
    {
      code: "function doSomething(gParam, EKSEPTION) { const lConst=gParam*EKSEPTION }",
      output:
        "function doSomething(pParam, EKSEPTION) { const lConst=pParam*EKSEPTION }",
      options: [{ exceptions: ["EKSEPTION"] }],
      errors: [
        {
          message: `parameter 'gParam' should be pascal case and start with a 'p': 'pParam'`,
          type: "FunctionDeclaration",
        },
      ],
    },
  ],
};
ruleTesterTypeScriptParser.run(
  "integration: parameter-pattern - TypeScript parser",
  rule,
  PARAMETER_PATTERN_CASES,
);

ruleTesterDefaultParser.run(
  "integration: parameter-pattern - default parser",
  rule,
  PARAMETER_PATTERN_CASES,
);

const PARAMETER_PATTERN_UNICODE_CASES = {
  valid: [
    "function функция (pПараметр) { }",
    "const ф = (pПараметр) => { }",
    // "const ф = (p参数) => { }"
  ],

  invalid: [
    {
      code: "function doSomething(параметр) { const lLala = параметр }",
      output: "function doSomething(pПараметр) { const lLala = pПараметр }",
      errors: [
        {
          message: `parameter 'параметр' should be pascal case and start with a 'p': 'pПараметр'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    {
      code: "const f = (функцияПараметр) => { }",
      output: "const f = (pФункцияПараметр) => { }",
      errors: [
        {
          message: `parameter 'функцияПараметр' should be pascal case and start with a 'p': 'pФункцияПараметр'`,
          type: "ArrowFunctionExpression",
        },
      ],
    },
    // replace snakes
    {
      code: "const f = (function_parameter) => { }",
      output: "const f = (pFunctionParameter) => { }",
      errors: [
        {
          message: `parameter 'function_parameter' should be pascal case and start with a 'p': 'pFunctionParameter'`,
          type: "ArrowFunctionExpression",
        },
      ],
    },
    {
      code: "const f = (функция_параметр) => { }",
      output: "const f = (pФункцияПараметр) => { }",
      errors: [
        {
          message: `parameter 'функция_параметр' should be pascal case and start with a 'p': 'pФункцияПараметр'`,
          type: "ArrowFunctionExpression",
        },
      ],
    },
    {
      code: "const f = (ФУНКЦИЯ_ПАРАМЕТР) => { }",
      output: "const f = (pФункцияПараметр) => { }",
      errors: [
        {
          message: `parameter 'ФУНКЦИЯ_ПАРАМЕТР' should be pascal case and start with a 'p': 'pФункцияПараметр'`,
          type: "ArrowFunctionExpression",
        },
      ],
    },
    // only replace within own scope
    {
      code: "function otherFunction() {let парам = 123} function doSomething(парам) { const lSomeConst = парам }",
      output:
        "function otherFunction() {let парам = 123} function doSomething(pПарам) { const lSomeConst = pПарам }",
      errors: [
        {
          message: `parameter 'парам' should be pascal case and start with a 'p': 'pПарам'`,
          type: "FunctionDeclaration",
        },
      ],
    },
    // replace whole word only
    {
      code: "function doSomething(парам) { const параметр=парам }",
      output: "function doSomething(pПарам) { const параметр=pПарам }",
      errors: [
        {
          message: `parameter 'парам' should be pascal case and start with a 'p': 'pПарам'`,
          type: "FunctionDeclaration",
        },
      ],
    },
  ],
};

ruleTesterTypeScriptParser.run(
  "integration: parameter-pattern unicode - TypeScript parser",
  rule,
  PARAMETER_PATTERN_UNICODE_CASES,
);

ruleTesterDefaultParser.run(
  "integration: parameter-pattern unicode - default parser",
  rule,
  PARAMETER_PATTERN_UNICODE_CASES,
);
