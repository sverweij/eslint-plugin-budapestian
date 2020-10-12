/**
 * @fileoverview enforce budapestian style rules
 * @author sverweij
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports.rules = {
  "parameter-pattern": require("./rules/parameter-pattern"),
  "global-constant-pattern": require("./rules/global-constant-pattern"),
  "global-variable-pattern": require("./rules/global-variable-pattern"),
  "local-variable-pattern": require("./rules/local-variable-pattern"),
};
