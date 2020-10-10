const camelcase = require("camelcase");
const _get = require("lodash.get");
const {
  VALID_PARAMETER_PATTERN,
  getIdentifierReplacementPattern,
} = require("./pattern-utl");
/**
 * @fileoverview Enforce function parameters to adhere to a pattern
 * @author sverweij
 */

function getParameterName(pParam) {
  return _get(pParam, "name", _get(pParam, "left.name", "pOK"));
}

function normalizeParameterName(pString) {
  return `p${camelcase(pString, { pascalCase: true })}`;
}

function parameterNameIsValid(pString) {
  return pString.match(VALID_PARAMETER_PATTERN);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function getFixes(pContext, pNode, pProblematicParameterNames, pFire) {
  if (pFire) {
    return (pFixer) => {
      let lBetterized = pProblematicParameterNames.reduce(
        (pSource, pProblematicParameterName) =>
          pSource.replace(
            getIdentifierReplacementPattern(pProblematicParameterName),
            `$1${normalizeParameterName(pProblematicParameterName)}$2`
          ),
        pContext.getSourceCode().getText(pNode)
      );

      return pFixer.replaceText(pNode, lBetterized);
    };
  }
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce function parameters to adhere to a pattern",
      category: "Stylistic Issues",
      recommended: false,
      url:
        "https://sverweij.github.io/eslint-plugin-budapestian/rules/parameter-pattern",
    },
    fixable: "code",
  },

  create: (pContext) => {
    function checkParameters(pNode, pContext) {
      const lProblematicParameterNames = _get(pNode, "params", [])
        .map(getParameterName)
        .filter((pParameterName) => !parameterNameIsValid(pParameterName));

      lProblematicParameterNames.forEach(
        (pProblematicParameterName, pIndex, pAllProblematicParameterNames) => {
          pContext.report({
            node: pNode,
            message: `parameter '{{ identifier }}' should be pascal case and start with a p: '{{ betterIdentifier }}'`,
            data: {
              identifier: pProblematicParameterName,
              betterIdentifier: normalizeParameterName(
                pProblematicParameterName
              ),
            },
            fix: getFixes(
              pContext,
              pNode,
              pAllProblematicParameterNames,
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
      FunctionDeclaration(pNode) {
        checkParameters(pNode, pContext);
      },
      ArrowFunctionExpression(pNode) {
        checkParameters(pNode, pContext);
      },
    };
  },
};
