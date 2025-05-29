export function getVariableDeclaratorName(pDeclarator) {
  return pDeclarator?.id?.name ?? "OK_ANYWAY";
}

export function getParameterDeclaratorName(pParameterDeclarator) {
  return (
    pParameterDeclarator?.name ?? pParameterDeclarator?.left?.name ?? "pOK"
  );
}

export function isConstDeclaration(pNode) {
  return pNode.type === "VariableDeclaration" && pNode.kind === "const";
}

function isVarDeclaration(pNode) {
  return pNode.type === "VariableDeclaration" && pNode.kind === "var";
}

function isLetDeclaration(pNode) {
  return pNode.type === "VariableDeclaration" && pNode.kind === "let";
}

export function isLetOrVarDeclaration(pNode) {
  return isLetDeclaration(pNode) || isVarDeclaration(pNode);
}

export function isBlockScopedVarDeclaration(pNode) {
  return isLetDeclaration(pNode) || isConstDeclaration(pNode);
}

export function isExportNamedDeclaration(pNode) {
  return pNode.type === "ExportNamedDeclaration";
}
