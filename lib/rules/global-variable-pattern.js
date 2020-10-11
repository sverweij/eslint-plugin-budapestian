const {
  getVariableDeclaratorName,
  isLetOrVarDeclaration,
} = require("./ast-utl");
const {
  VALID_GLOBAL_VARIABLE_PATTERN,
  VALID_PARAMETER_PATTERN,
  VALID_LOCAL_VARIABLE_PATTERN,
  getIdentifierReplacementPattern,
  prefixPascalCaseIdentifier,
} = require("./pattern-utl");

/**
 * @fileoverview Enforce global variables to adhere to a pattern
 * @author sverweij
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function normalizeGlobalVariableName(pString) {
  if (
    pString.match(VALID_PARAMETER_PATTERN) ||
    pString.match(VALID_LOCAL_VARIABLE_PATTERN)
  ) {
    return "g" + pString.substring(1);
  }
  return prefixPascalCaseIdentifier(pString, "g");
}

function globalVariableNameIsValid(pString) {
  return pString.match(VALID_GLOBAL_VARIABLE_PATTERN);
}

function getFixes(pContext, pNode, pProblematicVariableNames, pFire) {
  // to prevent eslint from thinking there's overlap between two fixes apply all fixes at once
  // and only one time (the first time 'round works fine).
  // Note: also works without that condition because eslint blocks execution of the
  //       next fixes anyway
  if (pFire) {
    return (pFixer) => {
      let lBetterized = pProblematicVariableNames.reduce(
        (pSource, pProblematicVariableName) =>
          pSource.replace(
            getIdentifierReplacementPattern(pProblematicVariableName),
            `$1${normalizeGlobalVariableName(pProblematicVariableName)}$2`
          ),
        pContext.getSourceCode().getText(pNode)
      );

      return pFixer.replaceText(pNode, lBetterized);
    };
  }
}

function isProblematicGlobalVariableDeclarator(pVariableDeclarator) {
  let lReturnValue = false;

  if (
    !pVariableDeclarator.init ||
    ["Literal", "ObjectExpression", "ArrayExpression"].some(
      (pType) => pType === pVariableDeclarator.init.type
    )
  ) {
    lReturnValue = !globalVariableNameIsValid(
      getVariableDeclaratorName(pVariableDeclarator)
    );
  }
  return lReturnValue;
}

function getProblematicVariablesFromBody(pBody) {
  return pBody
    .filter(isLetOrVarDeclaration)
    .reduce((pAll, pConstantDeclaration) => {
      return pAll.concat(
        pConstantDeclaration.declarations
          .filter(isProblematicGlobalVariableDeclarator)
          .map(getVariableDeclaratorName)
      );
    }, []);
}

function reportProblematicVariables(pNode, pContext, pProblematicVariables) {
  pProblematicVariables.forEach(
    (pProblematicVariableName, pIndex, pAllProblematicVariableNames) => {
      pContext.report({
        node: pNode,
        message: `global variable '{{ identifier }}' should be pascal case and start with a g: '{{ betterIdentifier }}'`,
        data: {
          identifier: pProblematicVariableName,
          betterIdentifier: normalizeGlobalVariableName(
            pProblematicVariableName
          ),
        },
        fix: getFixes(
          pContext,
          pNode,
          pAllProblematicVariableNames,
          pIndex === 0
        ),
      });
    }
  );
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce global variables for literals to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url:
        "https://sverweij.github.io/eslint-plugin-budapestian/rules/global-variable-pattern",
    },
    fixable: "code",
  },

  create: (pContext) => {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function checkGlobalVariablePatternValidity(pNode, pContext) {
      const lProblematicGlobalVariables = getProblematicVariablesFromBody(
        pNode.body
      );

      reportProblematicVariables(pNode, pContext, lProblematicGlobalVariables);
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Program(pNode) {
        checkGlobalVariablePatternValidity(pNode, pContext);
      },
    };
  },
};
