/**
 * @fileoverview enforce budapestian style rules
 * @author sverweij
 */

// eslint-disable-next-line budapestian/global-constant-pattern
const { name, version } = require("../package.json");

const plugin = {
  meta: {
    name,
    version,
  },
  rules: {
    "parameter-pattern": require("./rules/parameter-pattern-rule"),
    "global-constant-pattern": require("./rules/global-constant-pattern-rule"),
    "global-variable-pattern": require("./rules/global-variable-pattern-rule"),
    "local-variable-pattern": require("./rules/local-variable-pattern-rule"),
  },
  configs: {},
};

// see https://eslint.org/docs/latest/extend/plugin-migration-flat-config why
// configs is not defined directly in the plugin object
Object.assign(plugin.configs, {
  recommended: {
    plugins: ["budapestian"],
    // the above documentation recommends to use plugins: { budapestian: plugin }
    // however, eslint 8 does not like that:
    // ESLint: 8.52.0
    //
    // TypeError: Converting circular structure to JSON
    rules: {
      "budapestian/parameter-pattern": "error",
      "budapestian/global-variable-pattern": "error",
      "budapestian/local-variable-pattern": [
        "error",
        { exceptions: ["i", "j", "k", "x", "y", "z"] },
      ],
      "budapestian/global-constant-pattern": "error",
    },
  },
});

module.exports = plugin;
