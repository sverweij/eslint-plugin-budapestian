import {
  getVariableDeclaratorName,
  getParameterDeclaratorName,
} from "#rules/ast-utl.js";
import { equal } from "node:assert/strict";
import { describe, it } from "node:test";

describe("ast-utl - getVariableDeclaratorName edge cases", () => {
  it("returns 'OK_ANYWAY' if the variable declarator is an empty object", () => {
    equal(getVariableDeclaratorName({}), "OK_ANYWAY");
  });
  it("returns 'OK_ANYWAY' if the variable declarator is an object with an id object without a name", () => {
    equal(getVariableDeclaratorName({ id: {} }), "OK_ANYWAY");
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    equal(getVariableDeclaratorName({ id: { name: "A_NAME" } }), "A_NAME");
  });
});

describe("ast-utl - getParameterDeclaratorName edge cases", () => {
  it("returns 'pOK' if the variable declarator is an empty object", () => {
    equal(getParameterDeclaratorName({}), "pOK");
  });
  it("returns 'pOK' if the variable declarator is an object with an left object without a name", () => {
    equal(getParameterDeclaratorName({ left: {} }), "pOK");
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    equal(getParameterDeclaratorName({ name: "pParameter" }), "pParameter");
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    equal(
      getParameterDeclaratorName({ left: { name: "pParameter" } }),
      "pParameter",
    );
  });
});
