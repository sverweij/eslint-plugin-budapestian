# eslint-plugin-budapestian

To make visually clear within a function body which variables are variables, and which ones
are regular constants or variables, we use a bastard variant of
[Hungarian notation](https://en.wikipedia.org/wiki/Hungarian_notation) where we treat elements
with a scope prefix:

- `p` for parameters
- `l` for local variables
- `g` for global variables
- For global constants we use the C convention of ALL_CAPS_SNAKE_CASE.

This convention makes weird re-assignment bugs immediately visible, and makes naming things
that would normally clash with regular javascript syntax a easier. E.g. you can't use
`function` as a parameter - so you need creativity to come up with something - `callback` is
a popular option for that. Just prefixing with a `p` removes that mental stress.

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
    "budapestian/local-variable-pattern": "error",
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
