const {
  getBanxicoCredentials,
} = require("../controllers/utils/getBanxicoCredentials");

describe("getBanxicoCredentials", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should return beta credentials in development environment", () => {
    process.env.NODE_ENV = "development";
    process.env.CRT_BANXICO_BETA = "beta_crt";
    process.env.PUBLIC_KEY_BANXICO_BETA = "beta_public_key";

    const { crtBanxico, publicKeyBanxico } = getBanxicoCredentials();

    expect(crtBanxico).toBe("beta_crt");
    expect(publicKeyBanxico).toBe("beta_public_key");
  });

  it("should return production credentials in production environment", () => {
    process.env.NODE_ENV = "production";
    process.env.CRT_BANXICO_PROD = "prod_crt";
    process.env.PUBLIC_KEY_BANXICO_PROD = "prod_public_key";

    const { crtBanxico, publicKeyBanxico } = getBanxicoCredentials();

    expect(crtBanxico).toBe("prod_crt");
    expect(publicKeyBanxico).toBe("prod_public_key");
  });
});
