const VALID_PARAMETER_PATTERN = /^(p[\p{Lu}]|_)\S*/u;
const VALID_CONSTANT_PATTERN = /^[\p{Lu}_][\p{Lu}\p{N}_]*$/u;

function getIdentifierReplacementPattern(pParameterName) {
  return new RegExp(
    `([^\\p{L}\\p{N}]|^)${pParameterName}([^\\p{L}\\p{N}]|$)`,
    "gu"
  );
}

module.exports = {
  VALID_PARAMETER_PATTERN,
  VALID_CONSTANT_PATTERN,
  getIdentifierReplacementPattern,
};
