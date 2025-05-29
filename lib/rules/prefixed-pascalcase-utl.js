import {
  getIdentifierReplacementPattern,
  isValidPrefixedIdentifier,
  normalizePrefixedIdentifier,
} from "./pattern-utl.js";
import { getVariableDeclaratorName } from "./ast-utl.js";

const NODE_TYPE2IDENTIFIER_TYPE = {
  Program: "global variable",
  FunctionDeclaration: "parameter",
  ArrowFunctionExpression: "parameter",
};

export function isProblemVariableDeclarator(pPrefix) {
  return (pDeclarator) =>
    !isValidPrefixedIdentifier(
      getVariableDeclaratorName(pDeclarator),
      pPrefix,
    ) &&
    (!pDeclarator.init ||
      ![
        "CallExpression",
        "MemberExpression",
        "NewExpression",
        "AwaitExpression",
      ].includes(pDeclarator.init.type));
}

function _getIdentifierFixes(pContext, pNode, pProblemVariableNames, pPrefix) {
  return (pFixer) => {
    let lImproved = pProblemVariableNames.reduce(
      (pSource, pProblemVariableName) =>
        pSource.replace(
          getIdentifierReplacementPattern(pProblemVariableName),
          `$1${normalizePrefixedIdentifier(pProblemVariableName, pPrefix)}$2`,
        ),
      pContext.getSourceCode().getText(pNode),
    );

    return pFixer.replaceText(pNode, lImproved);
  };
}

export function reportProblemIdentifiers(
  pNode,
  pContext,
  pProblemVariables,
  pPrefix,
) {
  pProblemVariables.forEach(
    (pProblemVariableName, _index, pAllProblemVariableNames) => {
      pContext.report({
        node: pNode,
        message: `{{ variableType }} '{{ identifier }}' should be pascal case and start with a '{{ prefix }}': '{{ betterIdentifier }}'`,
        data: {
          variableType:
            NODE_TYPE2IDENTIFIER_TYPE[pNode.type] || "local variable",
          identifier: pProblemVariableName,
          betterIdentifier: normalizePrefixedIdentifier(
            pProblemVariableName,
            pPrefix,
          ),
          prefix: pPrefix,
        },
        fix: _getIdentifierFixes(
          pContext,
          pNode,
          pAllProblemVariableNames,
          pPrefix,
        ),
      });
    },
  );
}
