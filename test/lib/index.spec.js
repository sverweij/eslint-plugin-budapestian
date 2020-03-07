const { rules } = require("../../lib/");
const expect = require("chai").expect;

describe("plugin index", () => {
  it("should have a parameter-pattern rule", () => {
    expect(rules).to.haveOwnProperty("parameter-pattern");
  });
});
