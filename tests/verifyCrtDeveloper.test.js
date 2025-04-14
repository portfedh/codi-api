const {
  verifyCrtDeveloper,
} = require("../controllers/utils/verifyCrtDeveloper");
const {
  getDeveloperCredentials,
} = require("../controllers/utils/getDeveloperCredentials");

jest.mock("../controllers/utils/getDeveloperCredentials");

describe("verifyCrtDeveloper", () => {
  it("should return 0 when certComercioProveedor matches crtOper", () => {
    getDeveloperCredentials.mockReturnValue({ crtOper: "expectedCrtOper" });

    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: "expectedCrtOper",
      },
    };

    expect(verifyCrtDeveloper(resultado)).toBe(0);
  });

  it("should return -4 when certComercioProveedor does not match crtOper", () => {
    getDeveloperCredentials.mockReturnValue({ crtOper: "expectedCrtOper" });

    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: "unexpectedCrtOper",
      },
    };

    expect(verifyCrtDeveloper(resultado)).toBe(-4);
  });

  it("should return -4 when certComercioProveedor is undefined", () => {
    getDeveloperCredentials.mockReturnValue({ crtOper: "expectedCrtOper" });

    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: undefined,
      },
    };

    expect(verifyCrtDeveloper(resultado)).toBe(-4);
  });
});
