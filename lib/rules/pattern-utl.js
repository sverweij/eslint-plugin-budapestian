const camelcase = require("camelcase");

function getIdentifierReplacementPattern(pIdentifier) {
  return new RegExp(
    `([^\\p{L}\\p{N}]|^)${pIdentifier}([^\\p{L}\\p{N}]|$)`,
    "gu"
  );
}

function isNotAnException(pExceptions) {
  return (pVariableName) => !pExceptions.includes(pVariableName);
}

function prefixPascalCaseIdentifier(pIdentifier, pPrefix) {
  return `${pPrefix}${camelcase(pIdentifier, { pascalCase: true })}`;
}

function isValidPrefixedIdentifier(pString, pPrefix) {
  let regex = RegExp(`^${pPrefix}[\\p{Lu}]\\S*`, "u");

  return regex.test(pString);
}
function isOneOfValidPrefixedIdentifiers(pString, pPrefixes) {
  return pPrefixes.some((pPrefix) =>
    isValidPrefixedIdentifier(pString, pPrefix)
  );
}

function normalizePrefixedIdentifier(pString, pPrefix) {
  if (isOneOfValidPrefixedIdentifiers(pString, ["g", "l", "p"])) {
    return pPrefix + pString.substring(1);
  }
  return prefixPascalCaseIdentifier(pString, pPrefix);
}

module.exports = {
  getIdentifierReplacementPattern,
  isNotAnException,
  isOneOfValidPrefixedIdentifiers,
  isValidPrefixedIdentifier,
  normalizePrefixedIdentifier,
};
