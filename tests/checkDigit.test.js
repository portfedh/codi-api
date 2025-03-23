const { checkDigit } = require("../controllers/utils/checkDigit");

describe("checkDigit", () => {
  test("should throw an error if digitoVerificadorCliente is not a number", () => {
    const resultado = {
      cadenaInformacion: { digitoVerificadorCliente: "not a number" },
    };
    expect(() => checkDigit(resultado)).toThrow(
      "digitoVerificadorCliente must be a number between 0 and 999,999,999"
    );
  });

  test("should throw an error if digitoVerificadorCliente is less than 0", () => {
    const resultado = { cadenaInformacion: { digitoVerificadorCliente: -1 } };
    expect(() => checkDigit(resultado)).toThrow(
      "digitoVerificadorCliente must be a number between 0 and 999,999,999"
    );
  });

  test("should throw an error if digitoVerificadorCliente is greater than 999999999", () => {
    const resultado = {
      cadenaInformacion: { digitoVerificadorCliente: 1000000000 },
    };
    expect(() => checkDigit(resultado)).toThrow(
      "digitoVerificadorCliente must be a number between 0 and 999,999,999"
    );
  });

  test("should not throw an error if digitoVerificadorCliente is a valid number within the range", () => {
    const resultado = {
      cadenaInformacion: { digitoVerificadorCliente: 123456789 },
    };
    expect(() => checkDigit(resultado)).not.toThrow();
  });
});
