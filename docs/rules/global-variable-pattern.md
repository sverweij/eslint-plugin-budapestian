# Enforce global constants adhere to a pattern (global-constant-pattern)

This rule enforces that global _literal_ variables (both `let` and `var`) are
in pascal case and start with a `p`.

🔧 The `--fix option` on the command line renames these variables to adhere to
the pattern taking existing snake and camel casing into account
(SOME_GLOBAL_VARIABLE => gSomeGlobalVariable)

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
// global const literals should be in upper case
// b.t.w. the fixer corrects this to gThisIsAGlobalVariable
let thisIsAGlobalVariable = "but it looks like a variable";

// multi const declaration with lower case only
let snakes_and_no_start_with_g = 1,
  secondvariable = 2;

// also assignments of arrays and objects to a global variable
// are subject to this rule
let thisIsAnArray = ["aap", "noot", "mies", "wim", "zus"];

let severity2coolness = {
  info: "cool",
  warn: "not cool - fix later",
  error: "very uncool - fix now",
};

// and for those pieces of code still using `var` for variables
// these will have to adhere to the same pattern
var some_GLOBAL_variable = "init";
```

Examples of **correct** code for this rule:

```javascript
// gPascalCase as it's an assignment of a literal to a global variable
let gGlobalVariable = 123;

// also in multi variable declarations
let gMultiple = 1,
  gVariables = 2,
  gInOneDeclaration = 3;

// gPascalCase is cool for array and object assignments
let gThisIsAnArray = ["aap", "noot", "mies", "wim", "zus"];

let gSeverity2Coolness = {
  info: "cool",
  warn: "not cool - fix later",
  error: "very uncool - fix now",
};

// assignments of call expressions to global variables are allowed without
// them having to be snaked upper case. (Note that it might be better
// to use consts for them if you can, anyway, but this rule is not about
// that)
let _ = require("lodash");
var stateMachineCat = require("state-machine-cat");

// the same for are arrow function expressions
let someFunction = () => {
  return "did stuff";
};
```

## Options

### exceptions

Type: `array`

If you want to allow some variable names to not adhere to the rule, you can
specify these. E.g. if you want the variable name `actually_allowed` to be
allowed as a global variable you can do this:

```json
"budapestian/global-variable-pattern": [
  "error",
  { "exceptions": ["actually_allowed", "tHiSoNe_too"] }
]
```

## When Not To Use It

- If you don't want to have this global variable naming convention.
- When you use variable names that contain non-ascii characters from alphabets that
  don't have upper and lower case.  
  E.g. `参数` will be flagged and cannot be auto corrected a.t.m. However, many non-ascii
  character sets work out of the box - e.g. `КОНСТАНТА_УЛУЧШЕНИЕ` _can_ be auto-corrected.
  Likewise `gПеременнаяПередача` is valid.
- The fixer doesn't take [variable shadowning](https://en.wikipedia.org/wiki/Variable_shadowing)/
  [name masking](<https://en.wikipedia.org/wiki/Name_resolution_(programming_languages)#Name_masking>)
  into account (yet). This is a bad practice anyway because it's a source of subtle, hard to detect bugs.
  If you suspect (or don't know) if you have any shadowed variables switch on eslint core's
  [no-shadow](https://eslint.org/docs/rules/no-shadow) rule.
