/**
 * @fileoverview enforce budapestian style rules
 * @author sverweij
 */
// eslint-disable-next-line budapestian/global-constant-pattern
import { createRequire } from "node:module";
import parameterPatternRule from "./rules/parameter-pattern-rule.js";
import globalConstantPatternRule from "./rules/global-constant-pattern-rule.js";
import globalVariablePatternRule from "./rules/global-variable-pattern-rule.js";
import localVariablePatternRule from "./rules/local-variable-pattern-rule.js";

const require = createRequire(import.meta.url);

const { name, version } = require("../package.json");

const plugin = {
  meta: {
    name,
    version,
  },
  rules: {
    "parameter-pattern": parameterPatternRule,
    "global-constant-pattern": globalConstantPatternRule,
    "global-variable-pattern": globalVariablePatternRule,
    "local-variable-pattern": localVariablePatternRule,
  },
  configs: {},
};

// see https://eslint.org/docs/latest/extend/plugin-migration-flat-config why
// configs is not defined directly in the plugin object
Object.assign(plugin.configs, {
  recommended: {
    // this is a weird flex, but apparently the way to do it in eslint 9.
    // eslint 8.52.0 (at least) did not like this and borked with
    // TypeError: Converting circular structure to JSON
    plugins: { budapestian: plugin },
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

export default plugin;
