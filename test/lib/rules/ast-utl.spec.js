const astUtl = require("../../../lib/rules/ast-utl.js");
const expect = require("chai").expect;

describe("ast-utl - getVariableDeclaratorName edge cases", () => {
  it("returns 'OK_ANYWAY' if the variable declarator is an empty object", () => {
    expect(astUtl.getVariableDeclaratorName({})).to.equal("OK_ANYWAY");
  });
  it("returns 'OK_ANYWAY' if the variable declarator is an object with an id object without a name", () => {
    expect(astUtl.getVariableDeclaratorName({ id: {} })).to.equal("OK_ANYWAY");
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    expect(
      astUtl.getVariableDeclaratorName({ id: { name: "A_NAME" } })
    ).to.equal("A_NAME");
  });
});

describe("ast-utl - getParameterDeclaratorName edge cases", () => {
  it("returns 'pOK' if the variable declarator is an empty object", () => {
    expect(astUtl.getParameterDeclaratorName({})).to.equal("pOK");
  });
  it("returns 'pOK' if the variable declarator is an object with an left object without a name", () => {
    expect(astUtl.getParameterDeclaratorName({ left: {} })).to.equal("pOK");
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    expect(astUtl.getParameterDeclaratorName({ name: "pParameter" })).to.equal(
      "pParameter"
    );
  });
  it("returns the name if the variable declarator is an object with an id object that has a name", () => {
    expect(
      astUtl.getParameterDeclaratorName({ left: { name: "pParameter" } })
    ).to.equal("pParameter");
  });
});
