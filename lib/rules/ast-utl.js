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

function isVariableDeclaration(pNode) {
  return (
    pNode.type === "VariableDeclaration" &&
    (pNode.kind === "let" || pNode.kind === "var")
  );
}

module.exports = {
  getVariableDeclaratorName,
  getParameterDeclaratorName,
  isConstDeclaration,
  isVariableDeclaration,
};
