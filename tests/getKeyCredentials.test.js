const { getKeyCredentials } = require("../controllers/utils/getKeyCredentials");

describe("getKeyCredentials", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return development keys when NODE_ENV is not production", () => {
    process.env.NODE_ENV = "development";
    process.env.PRIVATE_KEY_DEV = "devPrivateKey";
    process.env.PRIVATE_KEY_PASSPHRASE_DEV = "devPassphrase";
    process.env.PUBLIC_KEY_DEV = "devPublicKey";

    const credentials = getKeyCredentials();

    expect(credentials).toEqual({
      privateKey: "devPrivateKey",
      privateKeyPassphrase: "devPassphrase",
      publicKey: "devPublicKey",
    });
  });

  it("should return production keys when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production";
    process.env.PRIVATE_KEY_PROD = "prodPrivateKey";
    process.env.PRIVATE_KEY_PASSPHRASE_PROD = "prodPassphrase";
    process.env.PUBLIC_KEY_PROD = "prodPublicKey";

    const credentials = getKeyCredentials();

    expect(credentials).toEqual({
      privateKey: "prodPrivateKey",
      privateKeyPassphrase: "prodPassphrase",
      publicKey: "prodPublicKey",
    });
  });

  it("should return undefined for missing environment variables in development", () => {
    process.env.NODE_ENV = "development";
    delete process.env.PRIVATE_KEY_DEV;
    delete process.env.PRIVATE_KEY_PASSPHRASE_DEV;
    delete process.env.PUBLIC_KEY_DEV;

    const credentials = getKeyCredentials();

    expect(credentials).toEqual({
      privateKey: undefined,
      privateKeyPassphrase: undefined,
      publicKey: undefined,
    });
  });

  it("should return undefined for missing environment variables in production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.PRIVATE_KEY_PROD;
    delete process.env.PRIVATE_KEY_PASSPHRASE_PROD;
    delete process.env.PUBLIC_KEY_PROD;

    const credentials = getKeyCredentials();

    expect(credentials).toEqual({
      privateKey: undefined,
      privateKeyPassphrase: undefined,
      publicKey: undefined,
    });
  });

  it("should use development keys when NODE_ENV is test", () => {
    process.env.NODE_ENV = "test";
    process.env.PRIVATE_KEY_DEV = "testPrivateKey";
    process.env.PRIVATE_KEY_PASSPHRASE_DEV = "testPassphrase";
    process.env.PUBLIC_KEY_DEV = "testPublicKey";

    const credentials = getKeyCredentials();

    expect(credentials).toEqual({
      privateKey: "testPrivateKey",
      privateKeyPassphrase: "testPassphrase",
      publicKey: "testPublicKey",
    });
  });

  it("should return the correct structure with all expected properties", () => {
    process.env.NODE_ENV = "development";
    process.env.PRIVATE_KEY_DEV = "someKey";
    process.env.PRIVATE_KEY_PASSPHRASE_DEV = "somePassphrase";
    process.env.PUBLIC_KEY_DEV = "somePublicKey";

    const credentials = getKeyCredentials();

    expect(credentials).toHaveProperty("privateKey");
    expect(credentials).toHaveProperty("privateKeyPassphrase");
    expect(credentials).toHaveProperty("publicKey");
    expect(Object.keys(credentials).length).toBe(3);
  });

  it("should default to development keys when NODE_ENV is unset or unrecognized", () => {
    delete process.env.NODE_ENV;
    process.env.PRIVATE_KEY_DEV = "defaultDevPrivateKey";
    process.env.PRIVATE_KEY_PASSPHRASE_DEV = "defaultDevPassphrase";
    process.env.PUBLIC_KEY_DEV = "defaultDevPublicKey";

    const credentials = getKeyCredentials();

    expect(credentials).toEqual({
      privateKey: "defaultDevPrivateKey",
      privateKeyPassphrase: "defaultDevPassphrase",
      publicKey: "defaultDevPublicKey",
    });

    process.env.NODE_ENV = "unknown";
    const credentialsForUnknownEnv = getKeyCredentials();

    expect(credentialsForUnknownEnv).toEqual({
      privateKey: "defaultDevPrivateKey",
      privateKeyPassphrase: "defaultDevPassphrase",
      publicKey: "defaultDevPublicKey",
    });
  });
});
