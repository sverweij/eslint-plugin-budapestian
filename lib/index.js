/**
 * @fileoverview enforce budapestian style rules
 * @author sverweij
 */

module.exports = {
  rules: {
    "parameter-pattern": require("./rules/parameter-pattern-rule"),
    "global-constant-pattern": require("./rules/global-constant-pattern-rule"),
    "global-variable-pattern": require("./rules/global-variable-pattern-rule"),
    "local-variable-pattern": require("./rules/local-variable-pattern-rule"),
  },
  configs: {
    recommended: {
      plugins: ["budapestian"],
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
  },
};
