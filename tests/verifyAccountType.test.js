const { verifyAccountType } = require("../controllers/utils/verifyAccountType");

describe("verifyAccountType", () => {
  test("should return 0 for valid account type 40", () => {
    const resultado = { cadenaInformacion: { tipoCuentaCliente: 40 } };
    expect(verifyAccountType(resultado)).toBe(0);
  });

  test("should return 0 for valid account type 3", () => {
    const resultado = { cadenaInformacion: { tipoCuentaCliente: 3 } };
    expect(verifyAccountType(resultado)).toBe(0);
  });

  test("should return 0 for valid account type 10", () => {
    const resultado = { cadenaInformacion: { tipoCuentaCliente: 10 } };
    expect(verifyAccountType(resultado)).toBe(0);
  });

  test("should return -1 for invalid account type 99", () => {
    const resultado = { cadenaInformacion: { tipoCuentaCliente: 99 } };
    expect(verifyAccountType(resultado)).toBe(-1);
  });

  test("should return -1 for invalid account type as a string", () => {
    const resultado = { cadenaInformacion: { tipoCuentaCliente: "40" } };
    expect(verifyAccountType(resultado)).toBe(-1);
  });

  test("should return -1 for missing tipoCuentaCliente", () => {
    const resultado = { cadenaInformacion: {} };
    expect(verifyAccountType(resultado)).toBe(-1);
  });

  test("should return -1 for null tipoCuentaCliente", () => {
    const resultado = { cadenaInformacion: { tipoCuentaCliente: null } };
    expect(verifyAccountType(resultado)).toBe(-1);
  });

  test("should return -1 for undefined tipoCuentaCliente", () => {
    const resultado = { cadenaInformacion: { tipoCuentaCliente: undefined } };
    expect(verifyAccountType(resultado)).toBe(-1);
  });
});
