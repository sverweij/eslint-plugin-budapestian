// eslint-disable-next-line budapestian/global-constant-pattern
import { getVariableDeclaratorName, isLetOrVarDeclaration } from "./ast-utl.js";
import {
  isProblemVariableDeclarator,
  reportProblemIdentifiers,
} from "./prefixed-pascalcase-utl.js";
import { isNotAnException } from "./pattern-utl.js";

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

// disabling prefer-message-ids as we dynamically compose the message in the 'create' function
// eslint-disable-next-line eslint-plugin/prefer-message-ids
const meta = {
  type: "suggestion",
  docs: {
    description: "enforce global variables for literals to adhere to a pattern",
    category: "Stylistic Issues",
    recommended: false,
    url: "https://sverweij.github.io/eslint-plugin-budapestian/rules/global-variable-pattern",
  },
  fixable: "code",
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
  defaultOptions: [],
};
function create(pContext) {
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
}

export default {
  meta,
  create,
};
