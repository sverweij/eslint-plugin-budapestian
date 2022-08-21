function getVariableDeclaratorName(pDeclarator) {
  return pDeclarator?.id?.name ?? "OK_ANYWAY";
}

function getParameterDeclaratorName(pParameterDeclarator) {
  return (
    pParameterDeclarator?.name ?? pParameterDeclarator?.left?.name ?? "pOK"
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

function isExportNamedDeclaration(pNode) {
  return pNode.type === "ExportNamedDeclaration";
}

module.exports = {
  getVariableDeclaratorName,
  getParameterDeclaratorName,
  isConstDeclaration,
  isLetOrVarDeclaration,
  isBlockScopedVarDeclaration,
  isExportNamedDeclaration,
};
