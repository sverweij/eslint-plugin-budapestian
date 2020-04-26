function getValidParameterPattern() {
  return /^(p[\p{Lu}]|_)\S*/u;
}

function getIdentifierReplacementPattern(pParameterName) {
  return new RegExp(
    `([^\\p{L}\\p{N}]|^)${pParameterName}([^\\p{L}\\p{N}]|$)`,
    "gu"
  );
}

function getValidConstantPattern() {
  return /^[\p{Lu}_][\p{Lu}\p{N}_]*$/u;
}

module.exports = {
  getValidParameterPattern,
  getIdentifierReplacementPattern,
  getValidConstantPattern,
};
