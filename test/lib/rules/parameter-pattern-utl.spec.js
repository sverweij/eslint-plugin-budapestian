const {
  getValidParameterPattern,
  getParameterReplacementPattern
} = require("../../../lib/rules/parameter-pattern-utl");
const nodeVersionIsRecentEngough = require("../../../lib/utl/node-version-is-recent-enough");

if (nodeVersionIsRecentEngough()) {
  const expect = require("chai").expect;

  describe("parameter-pattern-utl - getValidParameterPattern", () => {
    it("on node 8 (and below) should have no flags", () => {
      expect(getValidParameterPattern(8).flags).to.equal("");
    });
    it("on node 10 (and up) should have the unicode flag", () => {
      expect(getValidParameterPattern(10).flags).to.equal("u");
    });
  });
  describe("parameter-pattern-utl - getParameterReplacementPattern", () => {
    it("on node 8 (and below) should have no flags", () => {
      expect(getParameterReplacementPattern("something", 8).flags).to.equal(
        "g"
      );
    });
    it("on node 10 (and up) should have the unicode flag", () => {
      expect(getParameterReplacementPattern("something", 10).flags).to.equal(
        "gu"
      );
    });
  });
}
