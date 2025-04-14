const {
  getCodiConsultaUrls,
} = require("../controllers/utils/getCodiConsultaUrls");

describe("getCodiConsultaUrls", () => {
  afterEach(() => {
    jest.resetModules(); // Clear the cache
  });

  it("should return production endpoints when NODE_ENV is 'production'", () => {
    process.env.NODE_ENV = "production";
    process.env.SITIO_CODI_CONSULTA_PROD_1 = "https://prod1.example.com";
    process.env.SITIO_CODI_CONSULTA_PROD_2 = "https://prod2.example.com";
    const result = getCodiConsultaUrls();
    expect(result).toEqual({
      primary: "https://prod1.example.com",
      secondary: "https://prod2.example.com",
    });
  });

  it("should return development endpoints when NODE_ENV is not 'production'", () => {
    process.env.NODE_ENV = "development";
    process.env.SITIO_CODI_CONSULTA_DEV_1 = "https://dev1.example.com";
    process.env.SITIO_CODI_CONSULTA_DEV_2 = "https://dev2.example.com";
    const result = getCodiConsultaUrls();
    expect(result).toEqual({
      primary: "https://dev1.example.com",
      secondary: "https://dev2.example.com",
    });
  });

  it("should return development endpoints when NODE_ENV is undefined", () => {
    process.env.NODE_ENV = undefined;
    process.env.SITIO_CODI_CONSULTA_DEV_1 = "https://dev1.example.com";
    process.env.SITIO_CODI_CONSULTA_DEV_2 = "https://dev2.example.com";
    const result = getCodiConsultaUrls();
    expect(result).toEqual({
      primary: "https://dev1.example.com",
      secondary: "https://dev2.example.com",
    });
  });
});
