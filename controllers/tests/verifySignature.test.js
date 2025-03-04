const { verifySignature } = require("./verifySignature");
const crypto = require("crypto");
const forge = require("node-forge");

jest.mock("crypto");
jest.mock("node-forge");

describe("verifySignature", () => {
  const mockObject = {
    selloDigital: "mockSignature",
    datosMC: { key: "value" },
    epoch: 1234567890,
  };
  const mockPublicKeyCertificate =
    "-----BEGIN CERTIFICATE-----\nmockCertificate\n-----END CERTIFICATE-----";
  const mockPublicKey =
    "-----BEGIN PUBLIC KEY-----\nmockPublicKey\n-----END PUBLIC KEY-----";
  const mockStringifiedJson =
    JSON.stringify(mockObject.datosMC) + mockObject.epoch;

  beforeEach(() => {
    forge.pki.certificateFromPem.mockReturnValue({
      publicKey: "mockPublicKeyObject",
    });
    forge.pki.publicKeyToPem.mockReturnValue(mockPublicKey);
    crypto.createVerify.mockReturnValue({
      update: jest.fn(),
      verify: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should verify the signature successfully", () => {
    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(mockObject, mockPublicKeyCertificate);

    expect(result).toBe(true);
    expect(forge.pki.certificateFromPem).toHaveBeenCalledWith(
      mockPublicKeyCertificate
    );
    expect(forge.pki.publicKeyToPem).toHaveBeenCalledWith(
      "mockPublicKeyObject"
    );
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObject.selloDigital,
      "base64"
    );
  });

  it("should return false for incorrect signature", () => {
    crypto.createVerify().verify.mockReturnValue(false);

    const result = verifySignature(mockObject, mockPublicKeyCertificate);

    expect(result).toBe(false);
  });

  it("should throw an error if verification fails", () => {
    forge.pki.certificateFromPem.mockImplementation(() => {
      throw new Error("mock error");
    });

    expect(() => verifySignature(mockObject, mockPublicKeyCertificate)).toThrow(
      "Failed to verify signature"
    );
  });
});
