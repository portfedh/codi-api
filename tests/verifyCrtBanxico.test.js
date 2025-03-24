const { verifyCrtBanxico } = require("../controllers/utils/verifyCrtBanxico");
jest.mock("../controllers/utils/getBanxicoCredentials", () => ({
  getBanxicoCredentials: () => ({ crtBanxico: "00000100000100015974" }),
}));

describe("verifyCrtBanxico", () => {
  test("should return 0 when crtBanxico matches resultado.cadenaInformacion.certBdeM", () => {
    const resultado = {
      cadenaInformacion: {
        certBdeM: "00000100000100015974",
      },
    };
    expect(verifyCrtBanxico(resultado)).toBe(0);
  });

  test("should return -5 when crtBanxico does not match resultado.cadenaInformacion.certBdeM", () => {
    const resultado = {
      cadenaInformacion: {
        certBdeM: "00000100000100015975",
      },
    };
    expect(verifyCrtBanxico(resultado)).toBe(-5);
  });
});
