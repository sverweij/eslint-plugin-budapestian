const {
  getVariableDeclaratorName,
  isLetOrVarDeclaration,
} = require("./ast-utl");
const {
  isProblemVariableDeclarator,
  reportProblemIdentifiers,
} = require("./prefixed-pascalcase-utl");
const { isNotAnException } = require("./pattern-utl");

/**
 * @fileoverview Enforce global variables to adhere to a pattern
 * @author sverweij
 */

function getProblemVariablesFromBody(pBody, pExceptions, pPrefix) {
  return pBody
    .filter(isLetOrVarDeclaration)
    .reduce((pAll, pConstantDeclaration) => {
      return pAll.concat(
        pConstantDeclaration.declarations
          .filter(isProblemVariableDeclarator(pPrefix))
          .map(getVariableDeclaratorName)
          .filter(isNotAnException(pExceptions)),
      );
    }, []);
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce global variables for literals to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://sverweij.github.io/eslint-plugin-budapestian/rules/global-variable-pattern",
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
    return {
      Program(pNode) {
        const lExceptions = pContext?.options[0]?.exceptions ?? [];
        const lPrefix = "g";

        const lProblemGlobalVariables = getProblemVariablesFromBody(
          pNode.body,
          lExceptions,
          lPrefix,
        );

        reportProblemIdentifiers(
          pNode,
          pContext,
          lProblemGlobalVariables,
          lPrefix,
        );
      },
    };
  },
};
