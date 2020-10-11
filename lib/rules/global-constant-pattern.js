const decamelize = require("decamelize");
const { getVariableDeclaratorName, isConstDeclaration } = require("./ast-utl");
const {
  getIdentifierReplacementPattern,
  VALID_GLOBAL_CONSTANT_PATTERN,
  VALID_PARAMETER_PATTERN,
  VALID_LOCAL_VARIABLE_PATTERN,
  VALID_GLOBAL_VARIABLE_PATTERN,
} = require("./pattern-utl");
/**
 * @fileoverview Enforce global constants to adhere to a pattern
 * @author sverweij
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function normalizeConstantName(pString) {
  let lReturnValue = pString;

  if (
    pString.match(VALID_PARAMETER_PATTERN) ||
    pString.match(VALID_LOCAL_VARIABLE_PATTERN) ||
    pString.match(VALID_GLOBAL_VARIABLE_PATTERN)
  ) {
    lReturnValue = pString.substring(1);
  }

  return decamelize(lReturnValue).toLocaleUpperCase();
}

function constantNameIsValid(pString) {
  return pString.match(VALID_GLOBAL_CONSTANT_PATTERN);
}

function getFixes(pContext, pNode, pProblematicConstantNames, pFire) {
  if (pFire) {
    return (pFixer) => {
      let lBetterized = pProblematicConstantNames.reduce(
        (pSource, pProblematicConstantName) =>
          pSource.replace(
            getIdentifierReplacementPattern(pProblematicConstantName),
            `$1${normalizeConstantName(pProblematicConstantName)}$2`
          ),
        pContext.getSourceCode().getText(pNode)
      );

      return pFixer.replaceText(pNode, lBetterized);
    };
  }
}

function isProblematicConstDeclarator(pConstantDeclarator) {
  return ["Literal", "ObjectExpression", "ArrayExpression"].some(
    (pType) =>
      pType === pConstantDeclarator.init.type &&
      !constantNameIsValid(getVariableDeclaratorName(pConstantDeclarator))
  );
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce global constants for literals to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url:
        "https://sverweij.github.io/eslint-plugin-budapestian/rules/global-constant-pattern",
    },
    fixable: "code",
  },

  create: (pContext) => {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function checkConstantPatternValidity(pNode, pContext) {
      const lProblematicConstants = pNode.body
        .filter(isConstDeclaration)
        .reduce((pAll, pConstantDeclaration) => {
          return pAll.concat(
            pConstantDeclaration.declarations
              .filter(isProblematicConstDeclarator)
              .map(getVariableDeclaratorName)
          );
        }, []);

      // report all problematic consts + ...
      // to prevent eslint from thinking there's overlap between two fixes apply all fixes at once
      // and only one time (the first time 'round works fine).
      // Note: also works without that condition because eslint blocks execution of the
      //       next fixes anyway
      lProblematicConstants.forEach(
        (pProblematicConstantName, pIndex, pAllProblematicConstantNames) => {
          pContext.report({
            node: pNode,
            message: `global constant '{{ identifier }}' should be snaked upper case: '{{ betterIdentifier }}'`,
            data: {
              identifier: pProblematicConstantName,
              betterIdentifier: normalizeConstantName(pProblematicConstantName),
            },
            fix: getFixes(
              pContext,
              pNode,
              pAllProblematicConstantNames,
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
        checkConstantPatternValidity(pNode, pContext);
      },
    };
  },
};
