const _get = require("lodash.get");
const decamelize = require("decamelize");
const {
  VALID_CONSTANT_PATTERN,
  getIdentifierReplacementPattern,
} = require("./pattern-utl");
/**
 * @fileoverview Enforce global constants to adhere to a pattern
 * @author sverweij
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function getConstantName(pConstantDeclarator) {
  return _get(pConstantDeclarator, "id.name", "OK_ANYWAY");
}

function normalizeConstantName(pString) {
  return decamelize(pString).toLocaleUpperCase();
}

function constantNameIsValid(pString) {
  return pString.match(VALID_CONSTANT_PATTERN);
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

function isConstDeclaration(pNode) {
  return pNode.type === "VariableDeclaration" && pNode.kind === "const";
}

function isProblematicConstDeclarator(pConstantDeclarator) {
  return ["Literal", "ObjectExpression", "ArrayExpression"].some(
    (pType) =>
      pType === pConstantDeclarator.init.type &&
      !constantNameIsValid(getConstantName(pConstantDeclarator))
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
              .map(getConstantName)
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
