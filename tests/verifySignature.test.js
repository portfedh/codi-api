const { verifySignature } = require("../controllers/utils/verifySignature");
const crypto = require("crypto");

describe("verifySignature", () => {
  // Generate a test key pair that we can use for signing and verification
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  // Create a self-signed certificate for testing
  const mockPublicKeyCertificate = `
-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUEF9QxrwJK8dTl/pAHGHZvpLz8HAwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yMzEwMTYxNTMwMzBaFw0yMzEx
MTUxNTMwMzBaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQCwjzmiVOsE84BwDn1OSProoyutcT8FCASKzIkU01x+
9p4U8dDZlVeF4yAp8F3Z0Gg/CVBTSfNZc2JCmAQq9cHQUMl70UQlTBGB10USaceL
Yv9GlVV3/HXVpQWDp8D5vPJETQIhNvXitCla/dkOUgYNGO9S+aPZ7OGp67/JLiYU
QGAPJvMiBWuKXkjzTOpw64YDtzPW8HNBzPP2jHPvHyBmCneBcpxAW5fpxuZ1BCi4
jo3MJm/qLXXFoYeGHJFBJY9djC8lGKKZOb9VUt29FbhBbWEOoyo2aEUOZ8n80m/H
RXzBVJV08HWvYIsE0yHO+GJuRnDEjC+HF2bKjW3FAgMBAAGjUzBRMB0GA1UdDgQW
BBRQFwIHldH/Orl2y8ROCsJ/xeh1KjAfBgNVHSMEGDAWgBRQFwIHldH/Orl2y8RO
CsJ/xeh1KjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBoShAI
SW7DOPoUhlABNNiS3Q4zLSvLwjy85X8PeQjjiKSjeCrBT8enpJvGiI4Xm3A+jzKs
GVx7BaYEHfA3uFYzWd5ETgH+BgZGZ/QPCzrly8PtgzCMEVGfZ7TC4aI7YFr0kDES
F4KvDOzX0SHaXLJhgzlPgwFfDQyyw9ZaylCVGkBCPgJvdb3Dd+sH5/CMR+HMFTnY
8aaKzqE38eaO5UsLC6TzFxmWzQtExU8w8dc5XrQpVz2SQGRp0v2XPZnmQRiDYQ3K
x7XKjfFbONLvj5l1LpHzXuJL0iGU7Ic64FbWFqKRfvgdYCWZIJEoRIb4BC0WD5Bi
KTmIHZhPpCmB3CmE
-----END CERTIFICATE-----
`;

  const generateSignature = (data) => {
    const signer = crypto.createSign("RSA-SHA512");
    signer.update(data);
    return signer.sign(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      "base64"
    );
  };

  it("should verify a valid signature for datosMC", () => {
    const object = {
      datosMC: { key: "value" },
      epoch: "1234567890",
      selloDigital: "",
    };
    const stringifiedJson = JSON.stringify(object.datosMC) + object.epoch;
    object.selloDigital = generateSignature(stringifiedJson);

    // Mock function to avoid actual certificate parsing
    jest
      .spyOn(require("node-forge").pki, "certificateFromPem")
      .mockImplementation(() => ({
        publicKey: {
          // This is a simplified mock, but it's enough to bypass the forge certificate parsing
        },
      }));

    jest
      .spyOn(require("node-forge").pki, "publicKeyToPem")
      .mockReturnValue(publicKey);

    const result = verifySignature(object, mockPublicKeyCertificate);
    expect(result).toBe(true);
  });

  it("should fail verification for an invalid signature", () => {
    const object = {
      datosMC: { key: "value" },
      epoch: "1234567890",
      selloDigital: "invalid_signature",
    };

    // Mock function to avoid actual certificate parsing
    jest
      .spyOn(require("node-forge").pki, "certificateFromPem")
      .mockImplementation(() => ({
        publicKey: {
          // This is a simplified mock
        },
      }));

    jest
      .spyOn(require("node-forge").pki, "publicKeyToPem")
      .mockReturnValue(publicKey);

    const result = verifySignature(object, mockPublicKeyCertificate);
    expect(result).toBe(false);
  });

  it("should throw a generic error for unsupported object structure", () => {
    const object = { unsupportedKey: "value" };

    expect(() => verifySignature(object, mockPublicKeyCertificate)).toThrow(
      "Failed to verify signature"
    );
  });

  it("should verify a valid signature for cadenaMC", () => {
    const object = {
      cadenaMC: { key: "value" },
      epoch: "1234567890",
      selloDigital: "",
    };
    const stringifiedJson = JSON.stringify(object.cadenaMC) + object.epoch;
    object.selloDigital = generateSignature(stringifiedJson);

    // Mock function to avoid actual certificate parsing
    jest
      .spyOn(require("node-forge").pki, "certificateFromPem")
      .mockImplementation(() => ({
        publicKey: {
          // This is a simplified mock
        },
      }));

    jest
      .spyOn(require("node-forge").pki, "publicKeyToPem")
      .mockReturnValue(publicKey);

    const result = verifySignature(object, mockPublicKeyCertificate);
    expect(result).toBe(true);
  });

  // Test for folioCodi scenario
  it("should verify a valid signature for folioCodi", () => {
    const object = {
      folioCodi: { id: "12345" },
      epoch: "1234567890",
      selloDigital: "",
    };
    const stringifiedJson = JSON.stringify(object.folioCodi) + object.epoch;
    object.selloDigital = generateSignature(stringifiedJson);

    // Mock function to avoid actual certificate parsing
    jest
      .spyOn(require("node-forge").pki, "certificateFromPem")
      .mockImplementation(() => ({
        publicKey: {
          // This is a simplified mock
        },
      }));

    jest
      .spyOn(require("node-forge").pki, "publicKeyToPem")
      .mockReturnValue(publicKey);

    const result = verifySignature(object, mockPublicKeyCertificate);
    expect(result).toBe(true);
  });

  // Test for peticionConsulta scenario
  it("should verify a valid signature for peticionConsulta", () => {
    const object = {
      peticionConsulta: { queryId: "Q123" },
      epoch: "1234567890",
      selloDigital: "",
    };
    const stringifiedJson =
      JSON.stringify(object.peticionConsulta) + object.epoch;
    object.selloDigital = generateSignature(stringifiedJson);

    // Mock function to avoid actual certificate parsing
    jest
      .spyOn(require("node-forge").pki, "certificateFromPem")
      .mockImplementation(() => ({
        publicKey: {
          // This is a simplified mock
        },
      }));

    jest
      .spyOn(require("node-forge").pki, "publicKeyToPem")
      .mockReturnValue(publicKey);

    const result = verifySignature(object, mockPublicKeyCertificate);
    expect(result).toBe(true);
  });

  // Test for resultado scenario
  it("should verify a valid signature for resultado", () => {
    const object = {
      resultado: { status: "success" },
      epoch: "1234567890",
      selloDigital: "",
    };
    const stringifiedJson = JSON.stringify(object.resultado) + object.epoch;
    object.selloDigital = generateSignature(stringifiedJson);

    // Mock function to avoid actual certificate parsing
    jest
      .spyOn(require("node-forge").pki, "certificateFromPem")
      .mockImplementation(() => ({
        publicKey: {
          // This is a simplified mock
        },
      }));

    jest
      .spyOn(require("node-forge").pki, "publicKeyToPem")
      .mockReturnValue(publicKey);

    const result = verifySignature(object, mockPublicKeyCertificate);
    expect(result).toBe(true);
  });
});
