const {
  verifyCrtDeveloper,
} = require("../controllers/utils/verifyCrtDeveloper");
const {
  getDeveloperCredentials,
} = require("../controllers/utils/getDeveloperCredentials");

jest.mock("../controllers/utils/getDeveloperCredentials");

describe("verifyCrtDeveloper", () => {
  it("should not throw an error when certComercioProveedor matches crtOper", () => {
    getDeveloperCredentials.mockReturnValue({ crtOper: "expectedCrtOper" });

    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: "expectedCrtOper",
      },
    };

    expect(() => verifyCrtDeveloper(resultado)).not.toThrow();
  });

  it("should throw an error when certComercioProveedor does not match crtOper", () => {
    getDeveloperCredentials.mockReturnValue({ crtOper: "expectedCrtOper" });

    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: "unexpectedCrtOper",
      },
    };

    expect(() => verifyCrtDeveloper(resultado)).toThrow(
      "certComercioProveedor does not match crtOper"
    );
  });
});
