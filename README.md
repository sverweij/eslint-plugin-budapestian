# eslint-plugin-budapestian

This plugin supports a bastard variant of
[Hungarian notation](https://en.wikipedia.org/wiki/Hungarian_notation) where we
write elements in PascalCase and prefix them with a scope:

- `p` for parameters
- `l` for local variables and constants
- `g` for global variables
- For global constants we use the C convention of ALL_CAPS_SNAKE_CASE.

This plugin not only supports these rules, it can **automatically fix** them.

## Why budapestian notation?

### It removes mental stress

You no longer have to think how to name a local variable with the same
meaning as a parameter in the function it occurs in:

```javascript
const SOME_GLOBAL_CONST = 3;

function doThingsWithThing(pThing, pCount = SOME_GLOBAL_CONST) {
  let lThing = pThing || "";

  return lThing.repeat(pCount);
}
```

If you need to pass something that's also a keyword, you don't have to
fret. Pascal case it and slap a prefix in front of it.

```javascript
function calculateYield(pLet) {
  // calculate the yield of the let
}

let gYield = calculateYield(pLet);
```

### It enhances visual grepping.

In the next snippet you don't have to scroll up to see that BUFFER_LIMIT is
some global constant defined up there. You also see that pString must be
a parameter of the current function, and lResult is a local variable.

```javascript
{
  //...
  if (pString.length <= BUFFER_LIMIT) {
    lResult = pString;
  } else {
    lResult = "you so big";
  }
  // ..
}
```

### It makes some bugs easier to spot

Budapestian notation avoids variable shadowing. E.g. compare these two snippets,
the first one without budapestian notation:

```javascript
let index = 3;
const hipster_array = ["beard", "grammophone", "transistor"];
// here index is the global variable

function doThing(index) {
  // here 'index' is the parameter, shadowning the global
  for (let index of hipster_array) {
    // here 'index' is the local variable, shadowing the parameter
    // and the global
  }
}
```

and this with budapestian notation:

```javascript
let gIndex = 3;
const HIPSTER_ARRAY = ["beard", "grammophone", "transistor"];
// here gIndex is the global variable

function doThing(pIndex) {
  // here 'pIndex' is the parameter
  for (let lIndex of HIPSTER_ARRAY) {
    // here 'lIndex' is the local variable
  }
}
```

### So, should I use this?

I use this convention on all my open source projects. This plugin exists primarily
to support that. It keeps the code consistent, and it makes it easy for contributors
(including myself) to use the convention.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-budapestian`:

```
$ npm install eslint-plugin-budapestian --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-budapestian` globally.

## Usage

### With the 'recommended' preset

To use the plugin and the recommended rules for budapestian notation, add
`plugins:budapestian/recommended` to the extends section of your `.eslintrc`:

```json
{
  "extends": ["plugin:budapestian/recommended"]
}
```

### Manually

Add `budapestian` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["budapestian"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "budapestian/parameter-pattern": "error",
    "budapestian/global-variable-pattern": "error",
    "budapestian/local-variable-pattern": [
      "error",
      { "exceptions": ["i", "j", "k", "x", "y", "z"] }
    ],
    "budapestian/global-constant-pattern": "error"
  }
}
```

## Supported Rules

| auto fixable? | rule                                                                         | description                                                    |
| ------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| yes           | [budapestian/parameter-pattern](docs/rules/parameter-pattern.md)             | pascal case function parameters and make them start with a `p` |
| yes           | [budapestian/global-variable-pattern](docs/rules/global-variable-pattern.md) | pascal case global variables and make them start with a `g`    |
| yes           | [budapestian/local-variable-pattern](docs/rules/local-variable-pattern.md)   | pascal case local variables and make them start with an `l`    |
| yes           | [budapestian/global-constant-pattern](docs/rules/global-constant-pattern.md) | makes sure global constants are in snaked upper case.          |

## Flare'n status section

![linting & test coverage - linux](https://github.com/sverweij/eslint-plugin-budapestian/workflows/linting%20&%20test%20coverage%20-%20linux/badge.svg)
[![npm stable version](https://img.shields.io/npm/v/eslint-plugin-budapestian.svg?logo=npm)](https://npmjs.com/package/eslint-plugin-budapestian)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
