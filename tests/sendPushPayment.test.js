const { sendPushPayment } = require("../controllers/sendPushPayment");
const { makeRequestWithFallback } = require("../controllers/utils/makeRequestWithFallback");
const { getDeveloperCredentials } = require("../controllers/utils/getDeveloperCredentials");
const { getKeyCredentials } = require("../controllers/utils/getKeyCredentials");
const { getBanxicoCredentials } = require("../controllers/utils/getBanxicoCredentials");
const { getCodiPushUrls } = require("../controllers/utils/getCodiPushUrls");
const { generateSignature } = require("../controllers/utils/generateDigitalSignature");
const { verifySignature } = require("../controllers/utils/verifySignature");
const { verifyBanxicoResponse } = require("../controllers/utils/verifyBanxicoResponse");
const { compareCrtBanxico } = require("../controllers/utils/compareCrtBanxico");
const { insertRequestResponse } = require("../controllers/utils/insertRequestResponse");

jest.mock("../controllers/utils/makeRequestWithFallback");
jest.mock("../controllers/utils/getDeveloperCredentials");
jest.mock("../controllers/utils/getKeyCredentials");
jest.mock("../controllers/utils/getBanxicoCredentials");
jest.mock("../controllers/utils/getCodiPushUrls");
jest.mock("../controllers/utils/generateDigitalSignature");
jest.mock("../controllers/utils/verifySignature");
jest.mock("../controllers/utils/verifyBanxicoResponse");
jest.mock("../controllers/utils/compareCrtBanxico");
jest.mock("../controllers/utils/insertRequestResponse");

describe("sendPushPayment", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        celularCliente: "5551234567",
        monto: 100,
        referenciaNumerica: "12345",
        concepto: "Test payment",
        vigencia: "24"
      },
      apiKey: "test-api-key-128-chars-long",
      headers: { "content-type": "application/json" }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Setup default mocks
    getCodiPushUrls.mockReturnValue({
      primary: "https://primary.example.com",
      secondary: "https://secondary.example.com"
    });
    getDeveloperCredentials.mockReturnValue({
      crtLogIn: "mock-crt-login",
      crtOper: "mock-crt-oper"
    });
    getKeyCredentials.mockReturnValue({
      publicKey: "mock-public-key"
    });
    getBanxicoCredentials.mockReturnValue({
      crtBanxico: "mock-banxico-crt",
      publicKeyBanxico: "mock-banxico-public-key"
    });
    generateSignature.mockResolvedValue("mock-signature");
    verifySignature.mockReturnValue(true);
    verifyBanxicoResponse.mockReturnValue({ success: true });
    compareCrtBanxico.mockReturnValue(true);
    insertRequestResponse.mockResolvedValue();

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Error Handling", () => {
    it("should return timeout-specific error message when makeRequestWithFallback throws timeout error", async () => {
      const timeoutError = new Error("Both requests failed. Primary error: timeout of 3000ms exceeded, Secondary error: timeout of 3000ms exceeded");
      makeRequestWithFallback.mockRejectedValue(timeoutError);

      await sendPushPayment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Service temporarily unavailable due to timeout - please try again later"
      });
    });

    it("should return generic error message for non-timeout errors", async () => {
      const genericError = new Error("Database connection failed");
      makeRequestWithFallback.mockRejectedValue(genericError);

      await sendPushPayment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Error processing Push request"
      });
    });

    it("should log error with requestObject when it exists", async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error("Test error");
      makeRequestWithFallback.mockRejectedValue(error);

      await sendPushPayment(mockReq, mockRes);

      expect(insertRequestResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          route: "/v2/codi/push",
          requestObject: expect.objectContaining({
            datosMC: expect.objectContaining({
              celularCliente: "5551234567",
              monto: 100,
              referenciaNumerica: "12345",
              concepto: "Test payment",
              vigencia: "24",
              apiKey: "test-api-key-128-chars-long"
            }),
            selloDigital: "mock-signature"
          }),
          responseStatus: 500
        })
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle error logging gracefully when requestObject is null", async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error("Early error before requestObject creation");
      getDeveloperCredentials.mockImplementation(() => {
        throw error;
      });

      await sendPushPayment(mockReq, mockRes);

      expect(insertRequestResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          route: "/v2/codi/push",
          requestObject: null,
          responseStatus: 500
        })
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Success Path", () => {
    it("should return success response when all operations complete successfully", async () => {
      const mockBanxicoResponse = {
        data: {
          codigo: "00",
          mensaje: "Success",
          folioOperacion: "test-folio"
        }
      };
      makeRequestWithFallback.mockResolvedValue(mockBanxicoResponse);

      await sendPushPayment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockBanxicoResponse.data
      });
    });
  });
});