# Enforce global constants adhere to a pattern (global-constant-pattern)

This rule enforces that global _literal_ constants are ALL_CAPS_SNAKE_CASE.

🔧 The `--fix option` on the command line renames these constants to adhere to the pattern
taking existing snake and camel casing into account (someGlobalConstant => SOME_GLOBAL_CONSTANT)

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
// global const literals should be in upper case
// b.t.w. the fixer corrects this to THIS_IS_A_GLOBAL_CONST
const thisIsAGlobalConst = "but it looks like a variable";

// multi const declaration with lower case only
const snakes_but_no_caps = 1,
  secondconstant = 2;

// also assignments of arrays and objects to a global constant
// are subject to this rule
const thisIsAnArray = ["aap", "noot", "mies", "wim", "zus"];

const severity2coolness = {
  info: "cool",
  warn: "not cool - fix later",
  error: "very uncool - fix now",
};
```

Examples of **correct** code for this rule:

```javascript
// upper case as it's an assignment of a literal to a global constant
const GLOBAL_CONSTANT = 123;

// also in multi const declarations
const MULTIPLE = 1,
  CONSTANTS = 2,
  IN_ONE_DECLARATION = 3;

// upper case is cool for array and object assignments
const THIS_IS_AN_ARRAY = ["aap", "noot", "mies", "wim", "zus"];

const SEVERITY2COOLNESS = {
  info: "cool",
  warn: "not cool - fix later",
  error: "very uncool - fix now",
};

// assignments of call expressions to global constants are allowed without
// them having to be snaked upper case.
const _ = require("lodash");
const stateMachineCat = require("state-machine-cat");

// the same for are arrow function expressions
const someFunction = () => {
  return "did stuff";
};
```

## Options

### exceptions

Type: `array`

If you want to allow some global constants names to not adhere to the rule, you
can specify these. E.g. if you want to use the constant names `π` and `e`, you
can do sol like so:

```json
"budapestian/global-constant-pattern": [
  "error",
  { "exceptions": ["π", "e"] }
]
```

## When Not To Use It

- If you don't want to have this global constant naming convention.
- When you use constant names that contain non-ascii characters from alphabets that
  don't have upper and lower case.  
  E.g. `参数` will be flagged and cannot be auto corrected a.t.m. However, many non-ascii
  character sets work out of the box - e.g. `константаУлучшение` _can_ be auto-corrected.
  Likewise `КОНСТАНТА_УЛУЧШЕНИЕ` is valid.
- The fixer doesn't take [variable shadowning](https://en.wikipedia.org/wiki/Variable_shadowing)/
  [name masking](<https://en.wikipedia.org/wiki/Name_resolution_(programming_languages)#Name_masking>)
  into account (yet). This is a bad practice anyway because it's a source of subtle, hard to detect bugs.
  If you suspect (or don't know) if you have any shadowed variables switch on eslint core's
  [no-shadow](https://eslint.org/docs/rules/no-shadow) rule.
