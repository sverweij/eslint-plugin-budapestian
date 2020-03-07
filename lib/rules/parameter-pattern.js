const _get = require("lodash.get");
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
    fixable: "code", // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: pContext => {
    const PARAMETER_PATTERN = /^(p[A-Z]|_)\S*/;

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

    function checkParameters(pNode, pContext) {
      _get(pNode, "params", []).forEach(pParam => {
        const lParameterName = getParameterName(pParam);
        if (!lParameterName.match(PARAMETER_PATTERN)) {
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
                  // TODO: doesn't work really well with non-ascii
                  //       maybe use the power of the AST(tm) here as well
                  //       instead of re-hacking
                  new RegExp(`(\\W|^)${lParameterName}(\\W|$)`, "g"),
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
