const _get = require("lodash.get");

function getVariableDeclaratorName(pDeclarator) {
  return _get(pDeclarator, "id.name", "OK_ANYWAY");
}

function getParameterDeclaratorName(pParameterDeclarator) {
  return _get(
    pParameterDeclarator,
    "name",
    _get(pParameterDeclarator, "left.name", "pOK")
  );
}

function isConstDeclaration(pNode) {
  return pNode.type === "VariableDeclaration" && pNode.kind === "const";
}

function isVarDeclaration(pNode) {
  return pNode.type === "VariableDeclaration" && pNode.kind === "var";
}

function isLetDeclaration(pNode) {
  return pNode.type === "VariableDeclaration" && pNode.kind === "let";
}

function isLetOrVarDeclaration(pNode) {
  return isLetDeclaration(pNode) || isVarDeclaration(pNode);
}

function isBlockScopedVarDeclaration(pNode) {
  return isLetDeclaration(pNode) || isConstDeclaration(pNode);
}

module.exports = {
  getVariableDeclaratorName,
  getParameterDeclaratorName,
  isConstDeclaration,
  isLetOrVarDeclaration,
  isBlockScopedVarDeclaration,
};
