const _get = require("lodash.get");
const {
  getValidParameterPattern,
  getParameterReplacementPattern
} = require("./parameter-pattern-utl");
/**
 * @fileoverview Enforce function parameters to adhere to a pattern
 * @author sverweij
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce function parameters to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url:
        "https://sverweij.github.io/eslint-plugin-budapestian/rules/parameter-pattern"
    },
    fixable: "code",
  },

  create: pContext => {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    function getParameterName(pParam) {
      return _get(pParam, "name", _get(pParam, "left.name", "pOK"));
    }

    function normalizeParameterName(pString) {
      return `p${pString
        .slice(0, 1)
        .toLocaleUpperCase()
        .concat(pString.slice(1))}`;
    }

    function parameterNameIsValid(pString) {
      return pString.match(getValidParameterPattern());
    }

    function checkParameters(pNode, pContext) {
      _get(pNode, "params", []).forEach(pParam => {
        const lParameterName = getParameterName(pParam);
        if (!parameterNameIsValid(lParameterName)) {
          pContext.report({
            node: pNode,
            message: `parameter '{{ identifier }}' should be pascal case and start with a p: '{{ betterIdentifier }}'`,
            data: {
              identifier: lParameterName,
              betterIdentifier: normalizeParameterName(lParameterName)
            },
            fix: pFixer => {
              const lBetterized = pContext
                .getSourceCode()
                .getText(pNode)
                .replace(
                  getParameterReplacementPattern(lParameterName),
                  `$1${normalizeParameterName(lParameterName)}$2`
                );
              return pFixer.replaceText(pNode, lBetterized);
            }
          });
        }
      });
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      FunctionDeclaration(pNode) {
        checkParameters(pNode, pContext);
      },
      ArrowFunctionExpression(pNode) {
        checkParameters(pNode, pContext);
      }
    };
  }
};
