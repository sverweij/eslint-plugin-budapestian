const {
  getVariableDeclaratorName,
  isBlockScopedVarDeclaration,
} = require("./ast-utl");
const {
  isProblemVariableDeclarator,
  reportProblemIdentifiers,
} = require("./prefixed-pascalcase-utl");
const { isNotAnException } = require("./pattern-utl");

/**
 * @fileoverview Enforce local variables to adhere to a pattern
 * @author sverweij
 */

function getProblemVariablesFromBody(pBody, pExceptions, pPrefix) {
  return pBody
    .filter(isBlockScopedVarDeclaration)
    .reduce((pAll, pBlockScopedVarDeclaration) => {
      return pAll.concat(
        pBlockScopedVarDeclaration.declarations
          .filter(isProblemVariableDeclarator(pPrefix))
          .map(getVariableDeclaratorName)
          .filter(isNotAnException(pExceptions)),
      );
    }, []);
}

function getProblemVariablesFromFor(pInitOrLeft, pExceptions, pPrefix) {
  let lReturnValue = [];

  if (isBlockScopedVarDeclaration(pInitOrLeft)) {
    lReturnValue = pInitOrLeft.declarations
      .filter(isProblemVariableDeclarator(pPrefix))
      .map(getVariableDeclaratorName)
      .filter(isNotAnException(pExceptions));
  }
  return lReturnValue;
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce local variable names to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://sverweij.github.io/eslint-plugin-budapestian/rules/local-variable-pattern",
    },
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          exceptions: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
      minItems: 0,
      maxItems: 1,
    },
    fixable: "code",
  },

  create: (pContext) => {
    const lExceptions = pContext?.options[0]?.exceptions ?? [];
    const lPrefix = "l";

    function checkHipsterForVariables(pNode, pContext, pExceptions, pPrefix) {
      const lProblemVariables = getProblemVariablesFromFor(
        pNode.left,
        pExceptions,
        pPrefix,
      );

      reportProblemIdentifiers(pNode, pContext, lProblemVariables, pPrefix);
    }

    return {
      BlockStatement(pNode) {
        const lProblemVariables = getProblemVariablesFromBody(
          pNode.body,
          lExceptions,
          lPrefix,
        );

        reportProblemIdentifiers(pNode, pContext, lProblemVariables, lPrefix);
      },
      ForStatement(pNode) {
        const lProblemVariables = getProblemVariablesFromFor(
          pNode.init,
          lExceptions,
          lPrefix,
        );
        reportProblemIdentifiers(pNode, pContext, lProblemVariables, lPrefix);
      },
      ForOfStatement(pNode) {
        checkHipsterForVariables(pNode, pContext, lExceptions, lPrefix);
      },
      ForInStatement(pNode) {
        checkHipsterForVariables(pNode, pContext, lExceptions, lPrefix);
      },
    };
  },
};
