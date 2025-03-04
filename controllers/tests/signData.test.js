const { signData } = require("../utils/signData");
const crypto = require("crypto");
const forge = require("node-forge");

jest.mock("crypto");
jest.mock("node-forge");

describe("signData", () => {
  const mockPrivateKeyPem = "mockPrivateKeyPem";
  const mockPassphrase = "mockPassphrase";
  const mockDecryptedPrivateKey = "mockDecryptedPrivateKey";
  const mockPrivateKeyPemString = "mockPrivateKeyPemString";
  const mockSignature = Buffer.from("mockSignature");

  beforeEach(() => {
    process.env.PRIVATE_KEY = mockPrivateKeyPem;
    process.env.PRIVATE_KEY_PASSPHRASE = mockPassphrase;

    forge.pki.decryptRsaPrivateKey.mockReturnValue(mockDecryptedPrivateKey);
    forge.pki.privateKeyToPem.mockReturnValue(mockPrivateKeyPemString);

    const mockSigner = {
      update: jest.fn(),
      sign: jest.fn().mockReturnValue(mockSignature),
    };
    crypto.createSign.mockReturnValue(mockSigner);
    crypto.constants = {
      RSA_PKCS1_PSS_PADDING: "mockPadding",
      RSA_PSS_SALTLEN_DIGEST: "mockSaltLength",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should sign data correctly", () => {
    const stringToSign = "testString";
    const result = signData(stringToSign);

    expect(forge.pki.decryptRsaPrivateKey).toHaveBeenCalledWith(
      mockPrivateKeyPem,
      mockPassphrase
    );
    expect(forge.pki.privateKeyToPem).toHaveBeenCalledWith(
      mockDecryptedPrivateKey
    );

    const mockSigner = crypto.createSign();
    expect(mockSigner.update).toHaveBeenCalledWith(stringToSign);
    expect(mockSigner.sign).toHaveBeenCalledWith({
      key: mockPrivateKeyPemString,
      padding: "mockPadding",
      saltLength: "mockSaltLength",
    });

    expect(result).toBe(mockSignature.toString("base64"));
  });

  it("should throw an error if private key decryption fails", () => {
    forge.pki.decryptRsaPrivateKey.mockReturnValue(null);

    expect(() => signData("testString")).toThrow(
      "Failed to sign hash with private key"
    );
  });

  it("should throw an error if an exception occurs", () => {
    forge.pki.decryptRsaPrivateKey.mockImplementation(() => {
      throw new Error("Decryption error");
    });

    expect(() => signData("testString")).toThrow(
      "Failed to sign hash with private key"
    );
  });
});
