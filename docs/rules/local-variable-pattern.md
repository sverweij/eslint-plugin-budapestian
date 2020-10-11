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

<!--
### Options

If there are any options, describe them here. Otherwise, delete this section.
-->

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
