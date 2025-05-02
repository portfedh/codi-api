const {
  fwdToCustomerUrl,
} = require("../controllers/utils/fwdToCustomerUrl");
const axios = require("axios");
const supabase = require("../config/supabase");

// Mock dependencies
jest.mock("axios");
jest.mock("../../config/supabase", () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
}));

// Mock console methods
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

describe("fwdToCustomerUrl", () => {
  const requestBody = {
    cadenaInformacion: {
      nombreCliente: "TestCustomer",
    },
    // ... other request body data
  };
  const validationResult = 200;
  const callbackUrl = "http://test-callback.com/hook";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should forward request successfully when customer and callback URL are found", async () => {
    const mockCustomerData = {
      data: { callback_url: callbackUrl },
      error: null,
    };
    supabase.from().select().eq().single.mockResolvedValue(mockCustomerData);
    axios.post.mockResolvedValue({ status: 200 });

    await fwdToCustomerUrl(requestBody, validationResult);

    expect(supabase.from).toHaveBeenCalledWith("customers");
    expect(supabase.select).toHaveBeenCalledWith("callback_url");
    expect(supabase.eq).toHaveBeenCalledWith("name_redacted", "TestCustomer");
    expect(supabase.single).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(callbackUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Validation-Result": validationResult,
      },
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Request forwarded to ${callbackUrl}, status: 200`
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle error when forwarding request fails", async () => {
    const mockCustomerData = {
      data: { callback_url: callbackUrl },
      error: null,
    };
    const forwardError = new Error("Network Error");
    forwardError.response = { status: 500, data: "Server Error" };
    supabase.from().select().eq().single.mockResolvedValue(mockCustomerData);
    axios.post.mockRejectedValue(forwardError);

    await fwdToCustomerUrl(requestBody, validationResult);

    expect(axios.post).toHaveBeenCalledWith(callbackUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Validation-Result": validationResult,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error forwarding request to ${callbackUrl}:`,
      {
        message: "Network Error",
        status: 500,
        data: "Server Error",
      }
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should log message when no callback URL is found for the customer", async () => {
    const mockCustomerData = { data: null, error: null }; // No customer found or no callback_url
    supabase.from().select().eq().single.mockResolvedValue(mockCustomerData);

    await fwdToCustomerUrl(requestBody, validationResult);

    expect(supabase.from).toHaveBeenCalledWith("customers");
    expect(supabase.select).toHaveBeenCalledWith("callback_url");
    expect(supabase.eq).toHaveBeenCalledWith("name_redacted", "TestCustomer");
    expect(supabase.single).toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `No callback URL found for customer: TestCustomer`
    );
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle error when querying Supabase fails", async () => {
    const dbError = new Error("Database connection failed");
    const mockCustomerData = { data: null, error: dbError };
    supabase.from().select().eq().single.mockResolvedValue(mockCustomerData); // Simulate Supabase error

    await fwdToCustomerUrl(requestBody, validationResult);

    expect(supabase.from).toHaveBeenCalledWith("customers");
    expect(supabase.select).toHaveBeenCalledWith("callback_url");
    expect(supabase.eq).toHaveBeenCalledWith("name_redacted", "TestCustomer");
    expect(supabase.single).toHaveBeenCalled();
    expect(axios.post).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error querying customer:",
      dbError
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
