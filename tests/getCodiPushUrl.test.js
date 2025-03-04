const { getCodiPushUrl } = require("../controllers/utils/getCodiPushUrl");

describe("getCodiPushUrl", () => {
  afterEach(() => {
    jest.resetModules(); // Reset modules to clear any cached environment variables
  });

  it("should return the production endpoint when NODE_ENV is 'production'", () => {
    process.env.NODE_ENV = "production";
    process.env.SITIO_CODI_PUSH_PROD_2 = "https://prod.example.com";
    const result = getCodiPushUrl();
    expect(result).toBe("https://prod.example.com");
  });

  it("should return the development endpoint when NODE_ENV is not 'production'", () => {
    process.env.NODE_ENV = "development";
    process.env.SITIO_CODI_PUSH_DEV_2 = "https://dev.example.com";
    const result = getCodiPushUrl();
    expect(result).toBe("https://dev.example.com");
  });

  it("should return development endpoint when NODE_ENV is undefined", () => {
    process.env.NODE_ENV = undefined;
    process.env.SITIO_CODI_PUSH_DEV_2 = "https://dev.example.com";
    const result = getCodiPushUrl();
    expect(result).toBe("https://dev.example.com");
  });
});
