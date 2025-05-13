const { forwardRequest } = require("../controllers/utils/forwardRequest");
const axios = require("axios");

// Mock axios
jest.mock("axios");

// Mock console methods
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

describe("forwardRequest", () => {
  const callbackUrl = "https://example.com/webhook";
  const requestBody = { 
    data: "test data",
    moreData: {
      nestedValue: 123
    }
  };
  const validationResult = 200;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should forward request successfully", async () => {
    const mockResponse = { status: 200, data: { success: true } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await forwardRequest(callbackUrl, requestBody, validationResult);

    expect(result).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(callbackUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Validation-Result": validationResult,
      },
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(`Request forwarded to ${callbackUrl}, status: 200`);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle errors when forwarding request", async () => {
    const error = new Error("Network Error");
    error.response = { status: 500, data: "Server Error" };
    axios.post.mockRejectedValue(error);

    const result = await forwardRequest(callbackUrl, requestBody, validationResult);

    expect(result).toBeNull();
    expect(axios.post).toHaveBeenCalledWith(callbackUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Validation-Result": validationResult,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error forwarding request:", {
      message: "Network Error",
      status: 500,
      data: "Server Error",
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should handle errors without response property", async () => {
    const error = new Error("Generic Error");
    axios.post.mockRejectedValue(error);

    const result = await forwardRequest(callbackUrl, requestBody, validationResult);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error forwarding request:", {
      message: "Generic Error",
      status: undefined,
      data: undefined,
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
