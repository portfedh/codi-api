const { verifySignature } = require("../controllers/utils/verifySignature");
const crypto = require("crypto");
const forge = require("node-forge");

jest.mock("crypto");
jest.mock("node-forge");
jest.mock("../controllers/utils/formatMonto", () => jest.fn());
const formatMonto = require("../controllers/utils/formatMonto");

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

  it("should verify the signature successfully with resultado property", () => {
    const mockObjectWithResultado = {
      ...mockObject,
      datosMC: undefined,
      resultado: { key: "value" },
    };
    const mockStringifiedJsonWithResultado =
      JSON.stringify(mockObjectWithResultado.resultado) +
      mockObjectWithResultado.epoch;

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithResultado,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(forge.pki.certificateFromPem).toHaveBeenCalledWith(
      mockPublicKeyCertificate
    );
    expect(forge.pki.publicKeyToPem).toHaveBeenCalledWith(
      "mockPublicKeyObject"
    );
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJsonWithResultado
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithResultado.selloDigital,
      "base64"
    );
  });

  it("should verify the signature with peticionConsulta property", () => {
    const mockObjectWithPeticionConsulta = {
      ...mockObject,
      datosMC: undefined,
      peticionConsulta: { key: "value" },
    };
    const mockStringifiedJson =
      JSON.stringify(mockObjectWithPeticionConsulta.peticionConsulta) +
      mockObjectWithPeticionConsulta.epoch;

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithPeticionConsulta,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithPeticionConsulta.selloDigital,
      "base64"
    );
  });

  it("should verify the signature with cadenaMC property", () => {
    const mockObjectWithCadenaMC = {
      ...mockObject,
      datosMC: undefined,
      cadenaMC: { key: "value" },
    };
    const mockStringifiedJson =
      JSON.stringify(mockObjectWithCadenaMC.cadenaMC) +
      mockObjectWithCadenaMC.epoch;

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithCadenaMC,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithCadenaMC.selloDigital,
      "base64"
    );
  });

  it("should verify the signature with folioCodi property", () => {
    const mockObjectWithFolioCodi = {
      ...mockObject,
      datosMC: undefined,
      folioCodi: { key: "value" },
    };
    const mockStringifiedJson =
      JSON.stringify(mockObjectWithFolioCodi.folioCodi) +
      mockObjectWithFolioCodi.epoch;

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithFolioCodi,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithFolioCodi.selloDigital,
      "base64"
    );
  });

  it("should verify the signature with cadenaInformacion property", () => {
    const mockObjectWithCadenaInformacion = {
      ...mockObject,
      datosMC: undefined,
      cadenaInformacion: { key: "value" },
    };
    const mockStringifiedJson =
      JSON.stringify(mockObjectWithCadenaInformacion.cadenaInformacion) +
      mockObjectWithCadenaInformacion.epoch;

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithCadenaInformacion,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithCadenaInformacion.selloDigital,
      "base64"
    );
  });

  it("should verify the signature with string input instead of object", () => {
    const mockObjectWithStringInput = {
      ...mockObject,
      datosMC: undefined,
      cadenaInformacion: "string value",
    };
    const mockStringifiedJson =
      mockObjectWithStringInput.cadenaInformacion +
      mockObjectWithStringInput.epoch;

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithStringInput,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithStringInput.selloDigital,
      "base64"
    );
  });

  it("should use cadenaInformacion.horaEnvioMensaje for epoch when object.epoch is not provided", () => {
    const mockObjectWithHoraEnvioMensaje = {
      selloDigital: "mockSignature",
      datosMC: undefined,
      cadenaInformacion: {
        key: "value",
        horaEnvioMensaje: 9876543210,
      },
    };
    const mockStringifiedJson =
      JSON.stringify(mockObjectWithHoraEnvioMensaje.cadenaInformacion) +
      mockObjectWithHoraEnvioMensaje.cadenaInformacion.horaEnvioMensaje;

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithHoraEnvioMensaje,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockStringifiedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithHoraEnvioMensaje.selloDigital,
      "base64"
    );
  });

  it("should verify the signature with formatted cadenaInformacion", () => {
    const mockObjectWithFormattedCadenaInformacion = {
      ...mockObject,
      datosMC: undefined,
      cadenaInformacion: { key: "value" },
    };
    const mockFormattedJson = "formattedString";
    formatMonto.mockReturnValue(mockFormattedJson);

    crypto.createVerify().verify.mockReturnValue(true);

    const result = verifySignature(
      mockObjectWithFormattedCadenaInformacion,
      mockPublicKeyCertificate
    );

    expect(result).toBe(true);
    expect(formatMonto).toHaveBeenCalledWith(
      JSON.stringify(mockObjectWithFormattedCadenaInformacion.cadenaInformacion)
    );
    expect(crypto.createVerify().update).toHaveBeenCalledWith(
      mockFormattedJson
    );
    expect(crypto.createVerify().verify).toHaveBeenCalledWith(
      {
        key: mockPublicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      mockObjectWithFormattedCadenaInformacion.selloDigital,
      "base64"
    );
  });
});
