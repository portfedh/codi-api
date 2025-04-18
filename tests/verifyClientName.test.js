const { verifyClientName } = require("../controllers/utils/verifyClientName");

describe("verifyClientName", () => {
  it("should return 0 for a valid nombreCliente with alphanumeric characters", () => {
    const resultado = { cadenaInformacion: { nombreCliente: "Juan123" } };
    expect(verifyClientName(resultado)).toBe(0);
  });

  it("should return 0 for a valid nombreCliente with accented letters and spaces", () => {
    const resultado = { cadenaInformacion: { nombreCliente: "José Álvarez" } };
    expect(verifyClientName(resultado)).toBe(0);
  });

  it("should return 0 for a valid nombreCliente with asterisks", () => {
    const resultado = { cadenaInformacion: { nombreCliente: "Juan*" } };
    expect(verifyClientName(resultado)).toBe(0);
  });

  it("should return -1 for a nombreCliente longer than 40 characters", () => {
    const resultado = { cadenaInformacion: { nombreCliente: "a".repeat(41) } };
    expect(verifyClientName(resultado)).toBe(-1);
  });

  it("should return -1 for a nombreCliente with invalid characters", () => {
    const resultado = { cadenaInformacion: { nombreCliente: "Juan@123" } };
    expect(verifyClientName(resultado)).toBe(-1);
  });

  it("should return -1 for a missing nombreCliente", () => {
    const resultado = { cadenaInformacion: {} };
    expect(verifyClientName(resultado)).toBe(-1);
  });

  it("should return -1 for an undefined nombreCliente", () => {
    const resultado = { cadenaInformacion: { nombreCliente: undefined } };
    expect(verifyClientName(resultado)).toBe(-1);
  });

  it("should return -1 for a nombreCliente that is not a string", () => {
    const resultado = { cadenaInformacion: { nombreCliente: 12345 } };
    expect(verifyClientName(resultado)).toBe(-1);
  });
});
