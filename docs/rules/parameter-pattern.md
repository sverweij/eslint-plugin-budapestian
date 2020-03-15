# Enforce function parameters to adhere to a pattern (parameter-pattern)

This rule enforces that parameter names start with a `p` and are pascal cased. There's an exception for
starting with the `_` character as that (by convention) is often used for unused parameters.

🔧 The `--fix option` on the command line renames parameters to the correct pattern (including
any use in the function body).

## Rule Details

Examples of **incorrect** code for this rule:

```javascript
function f(thing, callback) {
  // do stuff
}

const f = thing => {
  /* do stuff */
};

const f = piedPiper => {
  /* do stuff */
};

const f = параметр => {
  /* do stuff */
};
```

Examples of **correct** code for this rule:

```javascript
function f(pThing, pFunction) {
  // do stuff
}

const f = pThing => {
  /* do stuff */
};

const f = pPiedPiper => {
  /* do stuff */
};

const f = pПараметр => {
  /* do stuff */
};

function f(_, pThing) {
  // to stuff with pThing, but not with _
}
```

<!--
### Options

If there are any options, describe them here. Otherwise, delete this section.
-->

## When Not To Use It

- If you don't want to have this parameter naming convention.
- When you use parameter names that contain non-ascii characters from alphabets that
  don't have upper and lower case.  
  E.g. `参数` will be flagged and cannot be auto corrected a.t.m., but `параметр` and
  `paramètre` _can_ be auto corrected. Likewise `pПараметр` and `pParamètre` are valid.

<!--
## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
-->
