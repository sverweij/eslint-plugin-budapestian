const astUtl = require("../../../lib/rules/ast-utl.js");
const { equal } = require("node:assert/strict");

describe("ast-utl - getVariableDeclaratorName edge cases", () => {
  it("returns 'OK_ANYWAY' if the variable declarator is an empty object", () => {
    equal(astUtl.getVariableDeclaratorName({}), "OK_ANYWAY");
  });
  it("returns 'OK_ANYWAY' if the variable declarator is an object with an id object without a name", () => {
    equal(astUtl.getVariableDeclaratorName({ id: {} }), "OK_ANYWAY");
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    equal(
      astUtl.getVariableDeclaratorName({ id: { name: "A_NAME" } }),
      "A_NAME",
    );
  });
});

describe("ast-utl - getParameterDeclaratorName edge cases", () => {
  it("returns 'pOK' if the variable declarator is an empty object", () => {
    equal(astUtl.getParameterDeclaratorName({}), "pOK");
  });
  it("returns 'pOK' if the variable declarator is an object with an left object without a name", () => {
    equal(astUtl.getParameterDeclaratorName({ left: {} }), "pOK");
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    equal(
      astUtl.getParameterDeclaratorName({ name: "pParameter" }),
      "pParameter",
    );
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    equal(
      astUtl.getParameterDeclaratorName({ left: { name: "pParameter" } }),
      "pParameter",
    );
  });
});
