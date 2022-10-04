const decamelize = require("decamelize");
const {
  getVariableDeclaratorName,
  isConstDeclaration,
  isExportNamedDeclaration,
} = require("./ast-utl");
const {
  // getIdentifierReplacementPattern,
  isNotAnException,
  isOneOfValidPrefixedIdentifiers,
} = require("./pattern-utl");

const VALID_GLOBAL_CONSTANT_PATTERN = /^[\p{Lu}][\p{Lu}\p{N}_]*$/u;

/**
 * @fileoverview Enforce global constants to adhere to a pattern
 * @author sverweij
 */

function normalizeConstantName(pString) {
  let lReturnValue = pString;

  if (isOneOfValidPrefixedIdentifiers(pString, ["g", "l", "p"])) {
    lReturnValue = pString.substring(1);
  }

  return decamelize(lReturnValue).toLocaleUpperCase();
}

function constantNameIsValid(pString) {
  return VALID_GLOBAL_CONSTANT_PATTERN.test(pString);
}

// function getFixes(pContext, pNode, pProblematicConstantNames) {
//   return (pFixer) => {
//     let lBetterized = pProblematicConstantNames.reduce(
//       (pSource, pProblematicConstantName) =>
//         pSource.replace(
//           getIdentifierReplacementPattern(pProblematicConstantName),
//           `$1${normalizeConstantName(pProblematicConstantName)}$2`
//         ),
//       pContext.getSourceCode().getText(pNode)
//     );

//     return pFixer.replaceText(pNode, lBetterized);
//   };
// }

function isProblematicConstDeclarator(pDeclarator) {
  return (
    !constantNameIsValid(getVariableDeclaratorName(pDeclarator)) &&
    [
      "Literal",
      "BinaryExpression",
      "Identifier",
      "ArrayExpression",
      "ObjectExpression",
    ].includes(pDeclarator.init.type)
  );
}

function getProblematicGlobalConstantsFromBody(pBody, pAllowedConstantNames) {
  const lExportConsts = pBody
    .filter(isExportNamedDeclaration)
    .map((pNode) => pNode.declaration)
    .filter((declaration) => declaration !== null)
    .filter(isConstDeclaration);
  const lGlobaConsts = pBody.filter(isConstDeclaration);
  return lExportConsts
    .concat(lGlobaConsts)
    .reduce(
      (pAll, pConstantDeclaration) =>
        pAll.concat(
          pConstantDeclaration.declarations
            .filter(isProblematicConstDeclarator)
            .map(getVariableDeclaratorName)
            .filter(isNotAnException(pAllowedConstantNames))
        ),
      []
    );
}

function reportProblematicGlobalConstants(
  pNode,
  pContext,
  pProblematicConstants
) {
  pProblematicConstants.forEach(
    // (pProblematicConstantName, _pIndex, pAllProblematicConstantNames) => {
    (pProblematicConstantName) => {
      pContext.report({
        node: pNode,
        message: `global constant '{{ identifier }}' should be snaked upper case: '{{ betterIdentifier }}'`,
        data: {
          identifier: pProblematicConstantName,
          betterIdentifier: normalizeConstantName(pProblematicConstantName),
        },
        // fix: getFixes(pContext, pNode, pAllProblematicConstantNames),
      });
    }
  );
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce global constants for literals to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://sverweij.github.io/eslint-plugin-budapestian/rules/global-constant-pattern",
    },
    // fixable: "code",
    fixable: false,
  },

  create: (pContext) => {
    return {
      Program(pNode) {
        const lExceptions = pContext?.options[0]?.exceptions ?? [];
        const lProblematicConstants = getProblematicGlobalConstantsFromBody(
          pNode.body,
          lExceptions
        );

        reportProblematicGlobalConstants(
          pNode,
          pContext,
          lProblematicConstants
        );
      },
    };
  },
};
