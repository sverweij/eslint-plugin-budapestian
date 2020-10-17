# Enforce local variables to adhere to a pattern (local-variable-pattern)

This rule enforces that local variables (let, const) start with a `l` and are
pascal cased.

🔧 When possible, the `--fix option` on the command line renames the variables to
the correct pattern.

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
const f = () => {
  let localVariable = 456;
};

const f = () => {
  const YetAnotherOne = 789;
};

function f() {
  let variable, another_one, yet_another;
}
```

Examples of **correct** code for this rule:

```javascript
const f = (pThing) => {
  let lLocalVariable = 456;
};

const f = () => {
  const lYetAnotherOne = 789;
};

function f() {
  let lVariable, lAnotherOne, lYetAnother;
}
```

## Options

### exceptions

Type: `array`

If you want to allow some variable names to not adhere to the rule, you can
specify these. E.g. if you're doing a lot of calculations in 3 dimensions
it might make sense to have the variables `x`, `y`, and `z` over anything
else for readability purposes.

```json
"budapestian/local-variable-pattern": [
  "error",
  { "exceptions": ["x", "y", "z"] }
]
```

## When Not To Use It

- If you don't want to have this local variable naming convention.
- When you use variable names that contain non-ascii characters from alphabets that
  don't have upper and lower case.  
  E.g. `变量` will be flagged and cannot be auto corrected a.t.m., but `переменная` and
  `variable_varié` _can_ be auto corrected. Likewise `pПеременная` and `pVariableVarié`
  are valid.

<!--
## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
-->
