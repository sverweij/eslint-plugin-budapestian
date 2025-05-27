/* eslint-disable no-prototype-builtins */
import { deepEqual, equal } from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import plugin from "#index.js";

describe("plugin index", () => {
  it("should have a parameter-pattern rule", () => {
    equal(plugin.rules.hasOwnProperty("parameter-pattern"), true);
  });

  it("should have an entry in index.js for each rule in the rules folder", () => {
    deepEqual(
      readdirSync(join("lib", "rules"))
        .filter((pFileName) => pFileName.match(/-rule\.js$/))
        .map(
          (pFileName) => pFileName.match(/^(?<name>\S*)-rule\.js$/).groups.name,
        )
        .sort(),
      Object.keys(plugin.rules).sort(),
    );
  });
});
