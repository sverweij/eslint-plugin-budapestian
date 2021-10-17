const _get = require("lodash.get");
const { getParameterDeclaratorName } = require("./ast-utl");
const { reportProblemIdentifiers } = require("./prefixed-pascalcase-utl");
const {
  isNotAnException,
  isValidPrefixedIdentifier,
} = require("./pattern-utl");

/**
 * @fileoverview Enforce function parameters to adhere to a pattern
 * @author sverweij
 */

function parameterNameIsValid(pString, pPrefix) {
  return isValidPrefixedIdentifier(pString, pPrefix) || pString.startsWith("_");
}

function getProblemParameterNames(pNode, pExceptions, pPrefix) {
  return _get(pNode, "params", [])
    .map(getParameterDeclaratorName)
    .filter((pParameterName) => !parameterNameIsValid(pParameterName, pPrefix))
    .filter(isNotAnException(pExceptions));
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce function parameters to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://sverweij.github.io/eslint-plugin-budapestian/rules/parameter-pattern",
    },
    fixable: "code",
  },

  create: (pContext) => {
    const lExceptions = _get(pContext, "options[0].exceptions", []);
    const lPrefix = "p";

    function checkParameters(pNode, pContext, pExceptions, pPrefix) {
      const lProblemParameterNames = getProblemParameterNames(
        pNode,
        pExceptions,
        pPrefix
      );
      reportProblemIdentifiers(
        pNode,
        pContext,
        lProblemParameterNames,
        pPrefix
      );
    }

    return {
      FunctionDeclaration(pNode) {
        checkParameters(pNode, pContext, lExceptions, lPrefix);
      },
      ArrowFunctionExpression(pNode) {
        checkParameters(pNode, pContext, lExceptions, lPrefix);
      },
    };
  },
};
