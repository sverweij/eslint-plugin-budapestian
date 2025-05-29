// eslint-disable-next-line budapestian/global-constant-pattern
import {
  getVariableDeclaratorName,
  isBlockScopedVarDeclaration,
} from "./ast-utl.js";
import {
  isProblemVariableDeclarator,
  reportProblemIdentifiers,
} from "./prefixed-pascalcase-utl.js";
import { isNotAnException } from "./pattern-utl.js";

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
// disabling prefer-message-ids as we dynamically compose the message in the 'create' function
// eslint-disable-next-line eslint-plugin/prefer-message-ids
const meta = {
  type: "suggestion",
  docs: {
    description: "enforce local variable names to adhere to a pattern",
    category: "Stylistic Issues",
    recommended: false,
    url: "https://sverweij.github.io/eslint-plugin-budapestian/rules/local-variable-pattern",
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
}

export default {
  meta,
  create,
};
