const { verifyCellPhone } = require("../controllers/utils/verifyCellPhone");

describe("verifyCellPhone", () => {
  it("should return 0 for a valid celularCliente with exactly 10 digits", () => {
    const resultado = { cadenaInformacion: { celularCliente: "1234567890" } };
    expect(verifyCellPhone(resultado)).toBe(0);
  });

  it("should return -3 for a celularCliente with less than 10 digits", () => {
    const resultado = { cadenaInformacion: { celularCliente: "123456789" } };
    expect(verifyCellPhone(resultado)).toBe(-3);
  });

  it("should return -3 for a celularCliente with more than 10 digits", () => {
    const resultado = { cadenaInformacion: { celularCliente: "12345678901" } };
    expect(verifyCellPhone(resultado)).toBe(-3);
  });

  it("should return -3 for a celularCliente with non-digit characters", () => {
    const resultado = { cadenaInformacion: { celularCliente: "12345abcde" } };
    expect(verifyCellPhone(resultado)).toBe(-3);
  });
});
