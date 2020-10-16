const _get = require("lodash.get");
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
  isNotAnException,
} = require("./pattern-utl");

/**
 * @fileoverview Enforce global variables to adhere to a pattern
 * @author sverweij
 */

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

function getFixes(pContext, pNode, pProblematicVariableNames) {
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

function getProblematicVariablesFromBody(pBody, pExceptions) {
  return pBody
    .filter(isLetOrVarDeclaration)
    .reduce((pAll, pConstantDeclaration) => {
      return pAll.concat(
        pConstantDeclaration.declarations
          .filter(isProblematicGlobalVariableDeclarator)
          .map(getVariableDeclaratorName)
          .filter(isNotAnException(pExceptions))
      );
    }, []);
}

function reportProblematicVariables(pNode, pContext, pProblematicVariables) {
  pProblematicVariables.forEach(
    (pProblematicVariableName, _pIndex, pAllProblematicVariableNames) => {
      pContext.report({
        node: pNode,
        message: `global variable '{{ identifier }}' should be pascal case and start with a g: '{{ betterIdentifier }}'`,
        data: {
          identifier: pProblematicVariableName,
          betterIdentifier: normalizeGlobalVariableName(
            pProblematicVariableName
          ),
        },
        fix: getFixes(pContext, pNode, pAllProblematicVariableNames),
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
    return {
      Program(pNode) {
        const EXCEPTIONS = _get(pContext, "options[0].exceptions", []);

        const lProblematicGlobalVariables = getProblematicVariablesFromBody(
          pNode.body,
          EXCEPTIONS
        );

        reportProblematicVariables(
          pNode,
          pContext,
          lProblematicGlobalVariables
        );
      },
    };
  },
};
