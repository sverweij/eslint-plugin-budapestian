function getMajorNodeVersion() {
  return process.versions.node.split(".").shift();
}

module.exports = function nodeVersionIsRecentEnough(pMajorNodeVersion = getMajorNodeVersion()) {
  return Number.parseInt(pMajorNodeVersion) >= 10;
};
