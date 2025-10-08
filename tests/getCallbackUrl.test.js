const { getCallbackUrl } = require("../controllers/utils/getCallbackUrl");

// Mock supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn()
};

// Mock console methods
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

describe("getCallbackUrl", () => {
  const apiKey = "api-key-12345";
  const callbackUrl = "https://example.com/webhook";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve callback URL when API key is found", async () => {
    mockSupabase.single.mockResolvedValue({
      data: { callback_url: callbackUrl },
      error: null
    });

    const result = await getCallbackUrl(apiKey, mockSupabase);

    expect(result).toBe(callbackUrl);
    expect(mockSupabase.from).toHaveBeenCalledWith("api_keys");
    expect(mockSupabase.select).toHaveBeenCalledWith("callback_url");
    expect(mockSupabase.eq).toHaveBeenCalledWith("api_key", apiKey);
    expect(mockSupabase.single).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should return null if there's an error querying the api_keys table", async () => {
    const error = { message: "Database error" };
    mockSupabase.single.mockResolvedValue({
      data: null,
      error
    });

    const result = await getCallbackUrl(apiKey, mockSupabase);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error querying api_keys table:", error);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should return null if no callback URL is found", async () => {
    mockSupabase.single.mockResolvedValue({
      data: { callback_url: null },
      error: null
    });

    const result = await getCallbackUrl(apiKey, mockSupabase);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(`No callback_url found for api_key: ${apiKey}`);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should handle when the API key data is not found", async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: null
    });

    const result = await getCallbackUrl(apiKey, mockSupabase);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(`No callback_url found for api_key: ${apiKey}`);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    const error = new Error("Unexpected error");
    mockSupabase.from.mockImplementation(() => {
      throw error;
    });

    const result = await getCallbackUrl(apiKey, mockSupabase);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error retrieving callback URL:", error.message);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
