const _get = require("lodash.get");

const {
  getIdentifierReplacementPattern,
  isValidPrefixedIdentifier,
  normalizePrefixedIdentifier,
} = require("./pattern-utl");
const { getVariableDeclaratorName } = require("./ast-utl");

const NODE_TYPE2IDENTIFIER_TYPE = {
  Program: "global variable",
  FunctionDeclaration: "parameter",
  ArrowFunctionExpression: "parameter",
};

function isProblemVariableDeclarator(pPrefix) {
  return (pDeclarator) =>
    !isValidPrefixedIdentifier(
      getVariableDeclaratorName(pDeclarator),
      pPrefix
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
    let lBetterized = pProblemVariableNames.reduce(
      (pSource, pProblemVariableName) =>
        pSource.replace(
          getIdentifierReplacementPattern(pProblemVariableName),
          `$1${normalizePrefixedIdentifier(pProblemVariableName, pPrefix)}$2`
        ),
      pContext.getSourceCode().getText(pNode)
    );

    return pFixer.replaceText(pNode, lBetterized);
  };
}

function reportProblemIdentifiers(pNode, pContext, pProblemVariables, pPrefix) {
  pProblemVariables.forEach(
    (pProblemVariableName, _index, pAllProblemVariableNames) => {
      pContext.report({
        node: pNode,
        message: `{{ variableType }} '{{ identifier }}' should be pascal case and start with a '{{ prefix }}': '{{ betterIdentifier }}'`,
        data: {
          variableType: _get(
            NODE_TYPE2IDENTIFIER_TYPE,
            pNode.type,
            "local variable"
          ),
          identifier: pProblemVariableName,
          betterIdentifier: normalizePrefixedIdentifier(
            pProblemVariableName,
            pPrefix
          ),
          prefix: pPrefix,
        },
        fix: _getIdentifierFixes(
          pContext,
          pNode,
          pAllProblemVariableNames,
          pPrefix
        ),
      });
    }
  );
}

module.exports = {
  isProblemVariableDeclarator,
  reportProblemIdentifiers,
};
