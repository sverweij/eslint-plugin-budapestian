// eslint-disable-next-line budapestian/global-constant-pattern
import { getParameterDeclaratorName } from "./ast-utl.js";
import { reportProblemIdentifiers } from "./prefixed-pascalcase-utl.js";
import { isNotAnException, isValidPrefixedIdentifier } from "./pattern-utl.js";

/**
 * @fileoverview Enforce function parameters to adhere to a pattern
 * @author sverweij
 */

function parameterNameIsValid(pString, pPrefix) {
  return isValidPrefixedIdentifier(pString, pPrefix) || pString.startsWith("_");
}

function getProblemParameterNames(pNode, pExceptions, pPrefix) {
  /* c8 ignore start */
  return (
    (pNode?.params ?? [])
      /* c8 ignore stop */
      .map(getParameterDeclaratorName)
      .filter(
        (pParameterName) => !parameterNameIsValid(pParameterName, pPrefix),
      )
      .filter(isNotAnException(pExceptions))
  );
}

// disabling prefer-message-ids as we dynamically compose the message in the 'create' function
// eslint-disable-next-line eslint-plugin/prefer-message-ids
const meta = {
  type: "suggestion",
  docs: {
    description: "enforce function parameters to adhere to a pattern",
    category: "Stylistic Issues",
    recommended: false,
    url: "https://sverweij.github.io/eslint-plugin-budapestian/rules/parameter-pattern",
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
  const lPrefix = "p";

  function checkParameters(pNode, pContext, pExceptions, pPrefix) {
    const lProblemParameterNames = getProblemParameterNames(
      pNode,
      pExceptions,
      pPrefix,
    );
    reportProblemIdentifiers(pNode, pContext, lProblemParameterNames, pPrefix);
  }

  return {
    FunctionDeclaration(pNode) {
      checkParameters(pNode, pContext, lExceptions, lPrefix);
    },
    ArrowFunctionExpression(pNode) {
      checkParameters(pNode, pContext, lExceptions, lPrefix);
    },
  };
}

export default {
  meta,
  create,
};
