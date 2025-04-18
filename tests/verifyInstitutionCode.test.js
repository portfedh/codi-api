const {
  verifyInstitutionCode,
} = require("../controllers/utils/verifyInstitutionCode");

jest.mock("../config/institutions.js", () => ({
  betaInstitutions: [{ clave_institucion: "123" }],
  productionInstitutions: [{ clave_institucion: "456" }],
}));

describe("verifyInstitutionCode", () => {
  it("should return 0 for a valid institution code in betaInstitutions", () => {
    const resultado = {
      cadenaInformacion: {
        claveInstitucionCliente: "123",
      },
    };

    expect(verifyInstitutionCode(resultado)).toBe(0);
  });

  it("should return 0 for a valid institution code in productionInstitutions", () => {
    const resultado = {
      cadenaInformacion: {
        claveInstitucionCliente: "456",
      },
    };

    expect(verifyInstitutionCode(resultado)).toBe(0);
  });

  it("should return -1 for an invalid institution code", () => {
    const resultado = {
      cadenaInformacion: {
        claveInstitucionCliente: "789",
      },
    };

    expect(verifyInstitutionCode(resultado)).toBe(-1);
  });

  it("should return -1 when claveInstitucionCliente is missing", () => {
    const resultado = {
      cadenaInformacion: {},
    };

    expect(verifyInstitutionCode(resultado)).toBe(-1);
  });

  it("should return -1 when cadenaInformacion is not an object", () => {
    const resultado = {
      cadenaInformacion: "notAnObject",
    };

    expect(verifyInstitutionCode(resultado)).toBe(-1);
  });

  it("should return -1 when resultado is not an object", () => {
    const resultado = "notAnObject";

    expect(verifyInstitutionCode(resultado)).toBe(-1);
  });
});
