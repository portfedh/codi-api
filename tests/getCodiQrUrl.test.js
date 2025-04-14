const { getCodiQrUrls } = require("../controllers/utils/getCodiQrUrl");

describe("getCodiQrUrls", () => {
  afterEach(() => {
    jest.resetModules(); // Clears any cache between tests.
  });

  it("should return production endpoints when NODE_ENV is 'production'", () => {
    process.env.NODE_ENV = "production";
    process.env.SITIO_CODI_QR_PROD_1 = "https://prod.primary.com";
    process.env.SITIO_CODI_QR_PROD_2 = "https://prod.secondary.com";
    const result = getCodiQrUrls();
    expect(result).toEqual({
      primary: "https://prod.primary.com",
      secondary: "https://prod.secondary.com",
    });
  });

  it("should return development endpoints when NODE_ENV is not 'production'", () => {
    process.env.NODE_ENV = "development";
    process.env.SITIO_CODI_QR_DEV_1 = "https://dev.primary.com";
    process.env.SITIO_CODI_QR_DEV_2 = "https://dev.secondary.com";
    const result = getCodiQrUrls();
    expect(result).toEqual({
      primary: "https://dev.primary.com",
      secondary: "https://dev.secondary.com",
    });
  });

  it("should return development endpoints when NODE_ENV is undefined", () => {
    process.env.NODE_ENV = undefined;
    process.env.SITIO_CODI_QR_DEV_1 = "https://dev.primary.example.com";
    process.env.SITIO_CODI_QR_DEV_2 = "https://dev.secondary.example.com";
    const result = getCodiQrUrls();
    expect(result).toEqual({
      primary: "https://dev.primary.example.com",
      secondary: "https://dev.secondary.example.com",
    });
  });
});
