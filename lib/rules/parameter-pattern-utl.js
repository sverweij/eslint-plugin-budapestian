const nodeVersionIsRecentEnough = require("../utl/node-version-is-recent-enough");

function getValidParameterPattern(pMajorNodeVersion) {
    // unicode pattern matching is only available from node 10
    return nodeVersionIsRecentEnough(pMajorNodeVersion)
        ? /^(p[\p{Lu}]|_)\S*/u
        : /^(p[A-Z]|_)\S*/;
}

function getParameterReplacementPattern(lParameterName, pMajorNodeVersion) {
    return nodeVersionIsRecentEnough(pMajorNodeVersion)
        ? new RegExp(
            `([^\\p{L}\\p{N}]|^)${lParameterName}([^\\p{L}\\p{N}]|$)`,
            "gu"
        )
        : new RegExp(`(\\W|^)${lParameterName}(\\W|$)`, "g");
}

module.exports = {
    getValidParameterPattern,
    getParameterReplacementPattern
}
