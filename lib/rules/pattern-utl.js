import camelcase from "camelcase";

export function getIdentifierReplacementPattern(pIdentifier) {
  return new RegExp(
    `([^\\p{L}\\p{N}]|^)${pIdentifier}([^\\p{L}\\p{N}]|$)`,
    "gu",
  );
}

export function isNotAnException(pExceptions) {
  return (pVariableName) => !pExceptions.includes(pVariableName);
}

function prefixPascalCaseIdentifier(pIdentifier, pPrefix) {
  return `${pPrefix}${camelcase(pIdentifier, { pascalCase: true })}`;
}

export function isValidPrefixedIdentifier(pString, pPrefix) {
  let regex = RegExp(`^${pPrefix}[\\p{Lu}]\\S*`, "u");

  return regex.test(pString);
}
export function isOneOfValidPrefixedIdentifiers(pString, pPrefixes) {
  return pPrefixes.some((pPrefix) =>
    isValidPrefixedIdentifier(pString, pPrefix),
  );
}

export function normalizePrefixedIdentifier(pString, pPrefix) {
  if (isOneOfValidPrefixedIdentifiers(pString, ["g", "l", "p"])) {
    return pPrefix + pString.substring(1);
  }
  return prefixPascalCaseIdentifier(pString, pPrefix);
}
