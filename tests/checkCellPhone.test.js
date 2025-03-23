const { checkCellPhone } = require("../controllers/utils/checkCellPhone");

// filepath: controllers/utils/checkCellPhone.test.js

describe("checkCellPhone", () => {
  it("should not throw an error for a valid celularCliente with exactly 10 digits", () => {
    const resultado = { cadenaInformacion: { celularCliente: "1234567890" } };
    expect(() => checkCellPhone(resultado)).not.toThrow();
  });

  it("should throw an error for a celularCliente with less than 10 digits", () => {
    const resultado = { cadenaInformacion: { celularCliente: "123456789" } };
    expect(() => checkCellPhone(resultado)).toThrow(
      "Invalid celularCliente: must be a string with exactly 10 digits."
    );
  });

  it("should throw an error for a celularCliente with more than 10 digits", () => {
    const resultado = { cadenaInformacion: { celularCliente: "12345678901" } };
    expect(() => checkCellPhone(resultado)).toThrow(
      "Invalid celularCliente: must be a string with exactly 10 digits."
    );
  });

  it("should throw an error for a celularCliente with non-digit characters", () => {
    const resultado = { cadenaInformacion: { celularCliente: "12345abcde" } };
    expect(() => checkCellPhone(resultado)).toThrow(
      "Invalid celularCliente: must be a string with exactly 10 digits."
    );
  });
});
