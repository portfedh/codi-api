const {
  insertRequestResponse,
} = require("../controllers/utils/insertRequestResponse");
const supabase = require("../config/supabase");

jest.mock("../config/supabase");

describe("insertRequestResponse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should insert request and response successfully", async () => {
    const mockRequestData = { id: 1 };
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest
            .fn()
            .mockResolvedValueOnce({ data: mockRequestData, error: null }),
        }),
      }),
    });
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: null }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    await insertRequestResponse(params);

    expect(supabase.from).toHaveBeenCalledTimes(2);
    expect(supabase.from).toHaveBeenCalledWith("requests");
    expect(supabase.from).toHaveBeenCalledWith("responses");
  });

  it("should log an error if request insertion fails", async () => {
    const mockError = { message: "Request insertion failed" };
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest
            .fn()
            .mockResolvedValueOnce({ data: null, error: mockError }),
        }),
      }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    console.error = jest.fn();

    await insertRequestResponse(params);

    expect(console.error).toHaveBeenCalledWith(
      "Error inserting API request:",
      mockError
    );
  });

  it("should log an error if response insertion fails", async () => {
    const mockRequestData = { id: 1 };
    const mockError = { message: "Response insertion failed" };
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest
            .fn()
            .mockResolvedValueOnce({ data: mockRequestData, error: null }),
        }),
      }),
    });
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: mockError }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    console.error = jest.fn();

    await insertRequestResponse(params);

    expect(console.error).toHaveBeenCalledWith(
      "Error inserting API response:",
      mockError
    );
  });

  it("should log a success message when both request and response insertions succeed", async () => {
    const mockRequestData = { id: 1 };
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest
            .fn()
            .mockResolvedValueOnce({ data: mockRequestData, error: null }),
        }),
      }),
    });
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: null }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    console.log = jest.fn();

    await insertRequestResponse(params);

    expect(console.log).toHaveBeenCalledWith(
      "API request and response logged successfully."
    );
  });

  it("should log an error if an unexpected error occurs", async () => {
    const mockError = new Error("Unexpected error");
    supabase.from.mockImplementationOnce(() => {
      throw mockError;
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    console.error = jest.fn();

    await insertRequestResponse(params);

    expect(console.error).toHaveBeenCalledWith(
      "Error logging API data:",
      mockError
    );
  });

  it("should use the correct environment variable", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test-environment";

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest
            .fn()
            .mockResolvedValueOnce({ data: { id: 1 }, error: null }),
        }),
      }),
    });
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: null }),
    });

    await insertRequestResponse(params);

    expect(supabase.from).toHaveBeenCalledWith("requests");
    expect(supabase.from).toHaveBeenCalledWith("responses");

    process.env.NODE_ENV = originalEnv; // Restore original environment
  });
});
