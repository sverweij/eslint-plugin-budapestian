const _get = require("lodash.get");
const { getParameterDeclaratorName } = require("./ast-utl");
const {
  VALID_PARAMETER_PATTERN,
  VALID_GLOBAL_VARIABLE_PATTERN,
  VALID_LOCAL_VARIABLE_PATTERN,
  getIdentifierReplacementPattern,
  prefixPascalCaseIdentifier,
  isNotAnException,
} = require("./pattern-utl");
/**
 * @fileoverview Enforce function parameters to adhere to a pattern
 * @author sverweij
 */

function normalizeParameterName(pString) {
  if (
    pString.match(VALID_GLOBAL_VARIABLE_PATTERN) ||
    pString.match(VALID_LOCAL_VARIABLE_PATTERN)
  ) {
    return "p" + pString.substring(1);
  }
  return prefixPascalCaseIdentifier(pString, "p");
}

function parameterNameIsValid(pString) {
  return pString.match(VALID_PARAMETER_PATTERN);
}

function getFixes(pContext, pNode, pProblematicParameterNames) {
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

function getProblematicParameterNames(pNode, pExceptions) {
  return _get(pNode, "params", [])
    .map(getParameterDeclaratorName)
    .filter((pParameterName) => !parameterNameIsValid(pParameterName))
    .filter(isNotAnException(pExceptions));
}

function reportProblematicParameters(
  pNode,
  pContext,
  pProblematicParameterNames
) {
  pProblematicParameterNames.forEach(
    (pProblematicParameterName, _pIndex, pAllProblematicParameterNames) => {
      pContext.report({
        node: pNode,
        message: `parameter '{{ identifier }}' should be pascal case and start with a p: '{{ betterIdentifier }}'`,
        data: {
          identifier: pProblematicParameterName,
          betterIdentifier: normalizeParameterName(pProblematicParameterName),
        },
        fix: getFixes(pContext, pNode, pAllProblematicParameterNames),
      });
    }
  );
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
    const EXCEPTIONS = _get(pContext, "options[0].exceptions", []);

    function checkParameters(pNode, pContext, pExceptions) {
      const lProblematicParameterNames = getProblematicParameterNames(
        pNode,
        pExceptions
      );

      reportProblematicParameters(pNode, pContext, lProblematicParameterNames);
    }

    return {
      FunctionDeclaration(pNode) {
        checkParameters(pNode, pContext, EXCEPTIONS);
      },
      ArrowFunctionExpression(pNode) {
        checkParameters(pNode, pContext, EXCEPTIONS);
      },
    };
  },
};
