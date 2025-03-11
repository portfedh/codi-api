const {
  getDeveloperCredentials,
} = require("../controllers/utils/getDeveloperCredentials");

describe("getDeveloperCredentials", () => {
  afterEach(() => {
    jest.resetModules(); // Clear the cache to reset process.env
  });

  it("should return the production credentials when NODE_ENV is 'production'", () => {
    process.env.NODE_ENV = "production";
    process.env.CRT_LOG_IN_PROD = "prod-crt-login";
    process.env.CRT_OPER_PROD = "prod-crt-oper";
    const credentials = getDeveloperCredentials();
    expect(credentials).toEqual({
      crtLogIn: "prod-crt-login",
      crtOper: "prod-crt-oper",
    });
  });

  it("should return the development credentials when NODE_ENV is not 'production'", () => {
    process.env.NODE_ENV = "development";
    process.env.CRT_LOG_IN_DEV = "dev-crt-login";
    process.env.CRT_OPER_DEV = "dev-crt-oper";
    const credentials = getDeveloperCredentials();
    expect(credentials).toEqual({
      crtLogIn: "dev-crt-login",
      crtOper: "dev-crt-oper",
    });
  });

  it("should return the development credentials when NODE_ENV is undefined", () => {
    process.env.NODE_ENV = undefined;
    process.env.CRT_LOG_IN_DEV = "dev-crt-login";
    process.env.CRT_OPER_DEV = "dev-crt-oper";
    const credentials = getDeveloperCredentials();
    expect(credentials).toEqual({
      crtLogIn: "dev-crt-login",
      crtOper: "dev-crt-oper",
    });
  });
});
