const { verifyDigit } = require("../controllers/utils/verifyDigit");

describe("checkDigit", () => {
  test("should return -2 if digitoVerificadorCliente is not a number", () => {
    const resultado = {
      cadenaInformacion: { digitoVerificadorCliente: "not a number" },
    };
    expect(verifyDigit(resultado)).toBe(-2);
  });

  test("should return -2 if digitoVerificadorCliente is less than 0", () => {
    const resultado = { cadenaInformacion: { digitoVerificadorCliente: -1 } };
    expect(verifyDigit(resultado)).toBe(-2);
  });

  test("should return -2 if digitoVerificadorCliente is greater than 999999999", () => {
    const resultado = {
      cadenaInformacion: { digitoVerificadorCliente: 1000000000 },
    };
    expect(verifyDigit(resultado)).toBe(-2);
  });

  test("should return 0 if digitoVerificadorCliente is a valid number within the range", () => {
    const resultado = {
      cadenaInformacion: { digitoVerificadorCliente: 123456789 },
    };
    expect(verifyDigit(resultado)).toBe(0);
  });
});
