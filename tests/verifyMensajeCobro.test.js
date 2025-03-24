const {
  verifyMensajeCobro,
} = require("../controllers/utils/verifyMensajeCobro");

// filepath: controllers/utils/verifyMensajeCobro.test.js

describe("verifyMensajeCobro", () => {
  it("should return -9 if mensajeCobro is not a string", () => {
    const resultado = { cadenaInformacion: { concepto: 123 } };
    expect(verifyMensajeCobro(resultado)).toBe(-9);
  });

  it("should return -9 if mensajeCobro is an empty string", () => {
    const resultado = { cadenaInformacion: { concepto: "" } };
    expect(verifyMensajeCobro(resultado)).toBe(-9);
  });

  it("should return 0 if mensajeCobro is a valid string", () => {
    const resultado = { cadenaInformacion: { concepto: "Valid Concept" } };
    expect(verifyMensajeCobro(resultado)).toBe(0);
  });
});
