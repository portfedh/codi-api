const { fwdToCustomerUrl } = require("../controllers/utils/fwdToCustomerUrl");
const { extractIdMensajeCobro } = require("../controllers/utils/extractIdMensajeCobro");
const { getApiKeyFromFolio } = require("../controllers/utils/getApiKeyFromFolio");
const { getCallbackUrl } = require("../controllers/utils/getCallbackUrl");
const { forwardRequest } = require("../controllers/utils/forwardRequest");
const supabase = require("../config/supabase");

// Mock helper functions
jest.mock("../controllers/utils/extractIdMensajeCobro");
jest.mock("../controllers/utils/getApiKeyFromFolio");
jest.mock("../controllers/utils/getCallbackUrl");
jest.mock("../controllers/utils/forwardRequest");
jest.mock("../config/supabase");

// Mock console methods
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

describe("fwdToCustomerUrl", () => {
  const requestBody = {
    cadenaInformacion: {
      idMensajeCobro: "TEST123456789"
    }
  };
  const validationResult = 200;
  const idMensajeCobro = "TEST123456789";
  const apiKey = "api-key-12345";
  const callbackUrl = "http://test-callback.com/hook";
  const forwardResponse = { status: 200, data: { success: true } };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should forward request successfully when all helper functions succeed", async () => {
    // Mock the helper functions
    extractIdMensajeCobro.mockReturnValue(idMensajeCobro);
    getApiKeyFromFolio.mockResolvedValue(apiKey);
    getCallbackUrl.mockResolvedValue(callbackUrl);
    forwardRequest.mockResolvedValue(forwardResponse);

    await fwdToCustomerUrl(requestBody, validationResult);

    // Check that helper functions were called with correct parameters
    expect(extractIdMensajeCobro).toHaveBeenCalledWith(requestBody);
    expect(getApiKeyFromFolio).toHaveBeenCalledWith(idMensajeCobro, supabase);
    expect(getCallbackUrl).toHaveBeenCalledWith(apiKey, supabase);
    expect(forwardRequest).toHaveBeenCalledWith(callbackUrl, requestBody, validationResult);
    
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should stop execution if idMensajeCobro extraction fails", async () => {
    // Mock the helper functions
    extractIdMensajeCobro.mockReturnValue(null);

    await fwdToCustomerUrl(requestBody, validationResult);

    // Check that only extractIdMensajeCobro was called
    expect(extractIdMensajeCobro).toHaveBeenCalledWith(requestBody);
    expect(getApiKeyFromFolio).not.toHaveBeenCalled();
    expect(getCallbackUrl).not.toHaveBeenCalled();
    expect(forwardRequest).not.toHaveBeenCalled();
  });

  it("should stop execution if getting API key fails", async () => {
    // Mock the helper functions
    extractIdMensajeCobro.mockReturnValue(idMensajeCobro);
    getApiKeyFromFolio.mockResolvedValue(null);

    await fwdToCustomerUrl(requestBody, validationResult);

    // Check that only the first two helper functions were called
    expect(extractIdMensajeCobro).toHaveBeenCalledWith(requestBody);
    expect(getApiKeyFromFolio).toHaveBeenCalledWith(idMensajeCobro, supabase);
    expect(getCallbackUrl).not.toHaveBeenCalled();
    expect(forwardRequest).not.toHaveBeenCalled();
  });

  it("should stop execution if getting callback URL fails", async () => {
    // Mock the helper functions
    extractIdMensajeCobro.mockReturnValue(idMensajeCobro);
    getApiKeyFromFolio.mockResolvedValue(apiKey);
    getCallbackUrl.mockResolvedValue(null);

    await fwdToCustomerUrl(requestBody, validationResult);

    // Check that only the first three helper functions were called
    expect(extractIdMensajeCobro).toHaveBeenCalledWith(requestBody);
    expect(getApiKeyFromFolio).toHaveBeenCalledWith(idMensajeCobro, supabase);
    expect(getCallbackUrl).toHaveBeenCalledWith(apiKey, supabase);
    expect(forwardRequest).not.toHaveBeenCalled();
  });

  it("should handle errors thrown during execution", async () => {
    // Mock the helper functions to throw an error
    extractIdMensajeCobro.mockReturnValue(idMensajeCobro);
    getApiKeyFromFolio.mockImplementation(() => {
      throw new Error("Test error");
    });

    await fwdToCustomerUrl(requestBody, validationResult);

    // Check that the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error in fwdToCustomerUrl:", {
      message: "Test error",
      status: undefined,
      data: undefined,
    });
  });
});
