const nodeVersionIsRecentEnough = require("../utl/node-version-is-recent-enough");

function getValidParameterPattern(pMajorNodeVersion) {
    // unicode pattern matching is only available from node 10
    return nodeVersionIsRecentEnough(pMajorNodeVersion)
        ? /^(p[\p{Lu}]|_)\S*/u
        : /^(p[A-Z]|_)\S*/;
}

function getIdentifierReplacementPattern(pParameterName, pMajorNodeVersion) {
    return nodeVersionIsRecentEnough(pMajorNodeVersion)
        ? new RegExp(
            `([^\\p{L}\\p{N}]|^)${pParameterName}([^\\p{L}\\p{N}]|$)`,
            "gu"
        )
        : new RegExp(`(\\W|^)${pParameterName}(\\W|$)`, "g");
}

function getValidConstantPattern(pMajorNodeVersion) {
    // unicode pattern matching is only available from node 10
    return nodeVersionIsRecentEnough(pMajorNodeVersion)
        ? /^[\p{Lu}_][\p{Lu}\p{N}_]*$/u
        : /^[A-Z_][A-Z0-9_]*$/;
}

module.exports = {
    getValidParameterPattern,
    getIdentifierReplacementPattern,
    getValidConstantPattern
}
