const { getSellerApiKey } = require("../controllers/utils/getSellerApiKey");

describe("getSellerApiKey", () => {
  afterEach(() => {
    jest.resetModules(); // Clear the cache to reset process.env
  });

  it("should return the production API key when NODE_ENV is 'production'", () => {
    process.env.NODE_ENV = "production";
    process.env.API_KEY_PROD = "prod-api-key";
    const apiKey = getSellerApiKey();
    expect(apiKey).toBe("prod-api-key");
  });

  it("should return the beta API key when NODE_ENV is not 'production'", () => {
    process.env.NODE_ENV = "development";
    process.env.API_KEY_BETA = "beta-api-key";
    const apiKey = getSellerApiKey();
    expect(apiKey).toBe("beta-api-key");
  });

  it("should return the beta API key when NODE_ENV is undefined", () => {
    process.env.NODE_ENV = undefined;
    process.env.API_KEY_BETA = "beta-api-key";
    const apiKey = getSellerApiKey();
    expect(apiKey).toBe("beta-api-key");
  });
});
