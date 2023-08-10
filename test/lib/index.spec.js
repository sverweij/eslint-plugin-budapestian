/* eslint-disable no-prototype-builtins */
const fs = require("fs");
const path = require("path");
const { rules } = require("../../lib/");
const { deepEqual, equal } = require("node:assert/strict");

describe("plugin index", () => {
  it("should have a parameter-pattern rule", () => {
    equal(rules.hasOwnProperty("parameter-pattern"), true);
  });

  it("should have an entry in index.js for each rule in the rules folder", () => {
    deepEqual(
      fs
        .readdirSync(path.join("lib", "rules"))
        .filter((pFileName) => pFileName.match(/-rule\.js$/))
        .map(
          (pFileName) => pFileName.match(/^(?<name>\S*)-rule\.js$/).groups.name,
        )
        .sort(),
      Object.keys(rules).sort(),
    );
  });
});
