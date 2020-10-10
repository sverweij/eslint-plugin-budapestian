const {
  getVariableDeclaratorName,
  isVariableDeclaration,
} = require("./ast-utl");
const {
  VALID_GLOBAL_VARIABLE_PATTERN,
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
  return prefixPascalCaseIdentifier(pString, "g");
}

function globalVariableNameIsValid(pString) {
  return pString.match(VALID_GLOBAL_VARIABLE_PATTERN);
}

function getFixes(pContext, pNode, pProblematicVariableNames, pFire) {
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
  return ["Literal", "ObjectExpression", "ArrayExpression"].some(
    (pType) =>
      pType === pVariableDeclarator.init.type &&
      !globalVariableNameIsValid(getVariableDeclaratorName(pVariableDeclarator))
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
      const lProblematicGlobalVariables = pNode.body
        .filter(isVariableDeclaration)
        .reduce((pAll, pConstantDeclaration) => {
          return pAll.concat(
            pConstantDeclaration.declarations
              .filter(isProblematicGlobalVariableDeclarator)
              .map(getVariableDeclaratorName)
          );
        }, []);

      // report all problematic lets & vars + ...
      // to prevent eslint from thinking there's overlap between two fixes apply all fixes at once
      // and only one time (the first time 'round works fine).
      // Note: also works without that condition because eslint blocks execution of the
      //       next fixes anyway
      lProblematicGlobalVariables.forEach(
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
