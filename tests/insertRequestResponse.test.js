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
      requestObject: { method: "POST" },
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

  it("should insert folioCodi into folios_codi when present in responsePayload", async () => {
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
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: null }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestObject: { method: "POST" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true, folioCodi: "FOLIO123" },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    await insertRequestResponse(params);

    expect(supabase.from).toHaveBeenCalledWith("folios_codi");
  });

  it("should log error if inserting folioCodi fails", async () => {
    const mockRequestData = { id: 1 };
    const folioCodiError = { message: "folioCodi insert failed" };
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
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: folioCodiError }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestObject: { method: "POST" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true, folioCodi: "FOLIO123" },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    console.error = jest.fn();

    await insertRequestResponse(params);

    expect(console.error).toHaveBeenCalledWith(
      "Error inserting folioCodi:",
      folioCodiError
    );
  });

  it("should log error if cadenaMC is invalid JSON", async () => {
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
      requestObject: { method: "POST" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true, cadenaMC: "{invalidJson" },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    console.error = jest.fn();

    await insertRequestResponse(params);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Error parsing cadenaMC or inserting IDC:"),
      expect.any(SyntaxError)
    );
  });

  it("should not insert IDC if cadenaMC does not contain ic.IDC", async () => {
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
      requestObject: { method: "POST" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: { success: true, cadenaMC: JSON.stringify({ ic: {} }) },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    await insertRequestResponse(params);

    // Only two inserts: requests and responses, no folios_codi for IDC
    expect(supabase.from).toHaveBeenCalledTimes(2);
  });

  it("should insert IDC as folio_codi if present in cadenaMC", async () => {
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
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: null }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestObject: { method: "POST" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: {
        success: true,
        cadenaMC: JSON.stringify({ ic: { IDC: "IDC123" } }),
      },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    await insertRequestResponse(params);

    expect(supabase.from).toHaveBeenCalledWith("folios_codi");
  });

  it("should log error if inserting IDC as folio_codi fails", async () => {
    const mockRequestData = { id: 1 };
    const idcInsertError = { message: "IDC insert failed" };
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
    supabase.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({ error: idcInsertError }),
    });

    const params = {
      route: "/v2/codi/push",
      requestHeaders: { "x-api-key": "test-api-key" },
      requestPayload: { key: "value" },
      requestObject: { method: "POST" },
      requestTimestamp: { format: () => "2023-01-01T00:00:00Z" },
      responsePayload: {
        success: true,
        cadenaMC: JSON.stringify({ ic: { IDC: "IDC123" } }),
      },
      responseStatus: 200,
      responseTimestamp: { format: () => "2023-01-01T00:01:00Z" },
    };

    console.error = jest.fn();

    await insertRequestResponse(params);

    expect(console.error).toHaveBeenCalledWith(
      "Error inserting IDC as folio_codi:",
      idcInsertError
    );
  });
});
