const { getCodiQrUrl } = require("../utils/getCodiQrUrl");

describe("getCodiQrUrl", () => {
  afterEach(() => {
    jest.resetModules(); // Clears any cache between tests.
  });

  it("should return the production endpoint when NODE_ENV is 'production'", () => {
    process.env.NODE_ENV = "production";
    process.env.SITIO_CODI_QR_PROD_2 = "https://prod.endpoint.com";
    const result = getCodiQrUrl();
    expect(result).toBe("https://prod.endpoint.com");
  });

  it("should return the development endpoint when NODE_ENV is not 'production'", () => {
    process.env.NODE_ENV = "development";
    process.env.SITIO_CODI_QR_DEV_2 = "https://dev.endpoint.com";
    const result = getCodiQrUrl();
    expect(result).toBe("https://dev.endpoint.com");
  });

  it("should return development endpoint when NODE_ENV is undefined", () => {
    process.env.NODE_ENV = undefined;
    process.env.SITIO_CODI_QR_DEV_2 = "https://dev.example.com";
    const result = getCodiQrUrl();
    expect(result).toBe("https://dev.example.com");
  });
});
