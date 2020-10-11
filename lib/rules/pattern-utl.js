const camelcase = require("camelcase");

const VALID_PARAMETER_PATTERN = /^(p[\p{Lu}]|_)\S*/u;
const VALID_GLOBAL_CONSTANT_PATTERN = /^[\p{Lu}_][\p{Lu}\p{N}_]*$/u;
const VALID_GLOBAL_VARIABLE_PATTERN = /^(g[\p{Lu}]|_)\S*/u;
const VALID_LOCAL_VARIABLE_PATTERN = /^(l[\p{Lu}])\S*/u;

function getIdentifierReplacementPattern(pIdentifier) {
  return new RegExp(
    `([^\\p{L}\\p{N}]|^)${pIdentifier}([^\\p{L}\\p{N}]|$)`,
    "gu"
  );
}

function prefixPascalCaseIdentifier(pIdentifier, pPrefix) {
  return `${pPrefix}${camelcase(pIdentifier, { pascalCase: true })}`;
}

module.exports = {
  VALID_PARAMETER_PATTERN,
  VALID_GLOBAL_CONSTANT_PATTERN,
  VALID_GLOBAL_VARIABLE_PATTERN,
  VALID_LOCAL_VARIABLE_PATTERN,
  getIdentifierReplacementPattern,
  prefixPascalCaseIdentifier,
};
