const {
  getVariableDeclaratorName,
  isBlockScopedVarDeclaration,
} = require("./ast-utl");
const {
  VALID_GLOBAL_VARIABLE_PATTERN,
  VALID_PARAMETER_PATTERN,
  VALID_LOCAL_VARIABLE_PATTERN,
  getIdentifierReplacementPattern,
  prefixPascalCaseIdentifier,
} = require("./pattern-utl");

/**
 * @fileoverview Enforce local variables to adhere to a pattern
 * @author sverweij
 */

function normalizeVariableName(pString) {
  if (
    pString.match(VALID_PARAMETER_PATTERN) ||
    pString.match(VALID_GLOBAL_VARIABLE_PATTERN)
  ) {
    return "l" + pString.substring(1);
  }
  return prefixPascalCaseIdentifier(pString, "l");
}

function variableNameIsValid(pString) {
  return pString.match(VALID_LOCAL_VARIABLE_PATTERN);
}

function getFixes(pContext, pNode, pProblematicVariableNames) {
  return (pFixer) => {
    let lBetterized = pProblematicVariableNames.reduce(
      (pSource, pProblematicVariableName) =>
        pSource.replace(
          getIdentifierReplacementPattern(pProblematicVariableName),
          `$1${normalizeVariableName(pProblematicVariableName)}$2`
        ),
      pContext.getSourceCode().getText(pNode)
    );

    return pFixer.replaceText(pNode, lBetterized);
  };
}

function isProblematicLocalVariableDeclarator(pVariableDeclarator) {
  let lReturnValue = false;

  if (
    !pVariableDeclarator.init ||
    ["Literal", "ObjectExpression", "ArrayExpression"].some(
      (pType) => pType === pVariableDeclarator.init.type
    )
  ) {
    lReturnValue = !variableNameIsValid(
      getVariableDeclaratorName(pVariableDeclarator)
    );
  }
  return lReturnValue;
}

function reportProblematicVariables(pNode, pContext, pProblematicVariables) {
  pProblematicVariables.forEach(
    (pProblematicVariableName, pIndex, pAllProblematicVariableNames) => {
      pContext.report({
        node: pNode,
        message: `variable '{{ identifier }}' should be pascal case and start with an l: '{{ betterIdentifier }}'`,
        data: {
          identifier: pProblematicVariableName,
          betterIdentifier: normalizeVariableName(pProblematicVariableName),
        },
        fix: getFixes(pContext, pNode, pAllProblematicVariableNames),
      });
    }
  );
}

function getProblematicVariablesFromBody(pBody) {
  return pBody
    .filter(isBlockScopedVarDeclaration)
    .reduce((pAll, pBlockScopedVarDeclaration) => {
      return pAll.concat(
        pBlockScopedVarDeclaration.declarations
          .filter(isProblematicLocalVariableDeclarator)
          .map(getVariableDeclaratorName)
      );
    }, []);
}

function getProblematicVariablesFromFor(pInitOrLeft) {
  let lReturnValue = [];

  if (isBlockScopedVarDeclaration(pInitOrLeft)) {
    lReturnValue = pInitOrLeft.declarations
      .filter(isProblematicLocalVariableDeclarator)
      .map(getVariableDeclaratorName);
  }
  return lReturnValue;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce local variable names to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url:
        "https://sverweij.github.io/eslint-plugin-budapestian/rules/local-variable-pattern",
    },
    fixable: "code",
  },

  create: (pContext) => {
    function checkHipsterForVariables(pNode, pContext) {
      const lProblematicVariables = getProblematicVariablesFromFor(pNode.left);

      reportProblematicVariables(pNode, pContext, lProblematicVariables);
    }

    return {
      BlockStatement(pNode) {
        const lProblematicVariables = getProblematicVariablesFromBody(
          pNode.body
        );

        reportProblematicVariables(pNode, pContext, lProblematicVariables);
      },
      ForStatement(pNode) {
        const lProblematicVariables = getProblematicVariablesFromFor(
          pNode.init
        );

        reportProblematicVariables(pNode, pContext, lProblematicVariables);
      },
      ForOfStatement(pNode) {
        checkHipsterForVariables(pNode, pContext);
      },
      ForInStatement(pNode) {
        checkHipsterForVariables(pNode, pContext);
      },
    };
  },
};
