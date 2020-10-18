const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const { rules } = require("../../lib/");

describe("plugin index", () => {
  it("should have a parameter-pattern rule", () => {
    expect(rules).to.haveOwnProperty("parameter-pattern");
  });

  it("should have an entry in index.js for each rule in the rules folder", () => {
    expect(
      fs
        .readdirSync(path.join("lib", "rules"))
        .filter((pFileName) => pFileName.match(/-rule\.js$/))
        .map(
          (pFileName) => pFileName.match(/^(?<name>\S*)-rule\.js$/).groups.name
        )
        .sort()
    ).to.deep.equal(Object.keys(rules).sort());
  });
});
