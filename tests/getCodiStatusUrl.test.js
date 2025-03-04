const { getCodiStatusURL } = require("../controllers/utils/getCodiStatusUrl");

describe("getCodiStatusURL", () => {
  afterEach(() => {
    jest.resetModules(); // Clear the cache
  });

  it("should return production endpoint when NODE_ENV is 'production'", () => {
    process.env.NODE_ENV = "production";
    process.env.SITIO_CODI_CONSULTA_PROD_2 = "https://prod.example.com";
    const result = getCodiStatusURL();
    expect(result).toBe("https://prod.example.com");
  });

  it("should return development endpoint when NODE_ENV is not 'production'", () => {
    process.env.NODE_ENV = "development";
    process.env.SITIO_CODI_CONSULTA_DEV_2 = "https://dev.example.com";
    const result = getCodiStatusURL();
    expect(result).toBe("https://dev.example.com");
  });

  it("should return development endpoint when NODE_ENV is undefined", () => {
    process.env.NODE_ENV = undefined;
    process.env.SITIO_CODI_CONSULTA_DEV_2 = "https://dev.example.com";
    const result = getCodiStatusURL();
    expect(result).toBe("https://dev.example.com");
  });
});
