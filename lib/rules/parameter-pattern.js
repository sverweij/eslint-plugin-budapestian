const _get = require("lodash.get");
const {
  getValidParameterPattern,
  getIdentifierReplacementPattern,
  getValidConstantPattern
} = require("./pattern-utl");
/**
 * @fileoverview Enforce function parameters to adhere to a pattern
 * @author sverweij
 */

function getParameterName(pParam) {
  return _get(pParam, "name", _get(pParam, "left.name", "pOK"));
}
function toInitCaps(pString) {
  return pString
    .slice(0, 1)
    .toLocaleUpperCase()
    .concat(
      // maybe not such a hot idea to use a function named after
      // a valid constant pattern, but otoh it's a perfect fit
      // maybe rename that function so it's usable in 2 spots? Copy?
      pString.slice(1).match(getValidConstantPattern())
        ? pString.slice(1).toLocaleLowerCase()
        : pString.slice(1)
    );
}
// wanted to use sindresorhus/camelize for this, but that is not unicode
// compliant yet
// handles snake_case and SNAKED_ALL_CAPS
function toPascalCase(pString) {
  return pString
    .split("_")
    .map(toInitCaps)
    .join("");
}

function normalizeParameterName(pString) {
  return `p${toPascalCase(pString)}`;
}

function parameterNameIsValid(pString) {
  return pString.match(getValidParameterPattern());
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function getFixes(pContext, pNode, pProblematicParameterNames, pFire) {
  if (pFire) {
    return pFixer => {
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
        "https://sverweij.github.io/eslint-plugin-budapestian/rules/parameter-pattern"
    },
    fixable: "code"
  },

  create: pContext => {
    function checkParameters(pNode, pContext) {
      const lProblematicParameterNames = _get(pNode, "params", [])
        .map(getParameterName)
        .filter(pParameterName => !parameterNameIsValid(pParameterName));

      lProblematicParameterNames.forEach(
        (pProblematicParameterName, pIndex, pAllProblematicParameterNames) => {
          pContext.report({
            node: pNode,
            message: `parameter '{{ identifier }}' should be pascal case and start with a p: '{{ betterIdentifier }}'`,
            data: {
              identifier: pProblematicParameterName,
              betterIdentifier: normalizeParameterName(
                pProblematicParameterName
              )
            },
            fix: getFixes(
              pContext,
              pNode,
              pAllProblematicParameterNames,
              pIndex === 0
            )
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
      }
    };
  }
};
