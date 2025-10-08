const { getApiKeyFromFolio } = require("../controllers/utils/getApiKeyFromFolio");

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

describe("getApiKeyFromFolio", () => {
  const idMensajeCobro = "TEST123456789";
  const apiKey = "api-key-12345";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve API key when folio is found", async () => {
    mockSupabase.single.mockResolvedValue({
      data: { api_key: apiKey },
      error: null
    });

    const result = await getApiKeyFromFolio(idMensajeCobro, mockSupabase);

    expect(result).toBe(apiKey);
    expect(mockSupabase.from).toHaveBeenCalledWith("folios_codi");
    expect(mockSupabase.select).toHaveBeenCalledWith("api_key");
    expect(mockSupabase.eq).toHaveBeenCalledWith("folio_codi", idMensajeCobro);
    expect(mockSupabase.single).toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should try with shortened idMensajeCobro if full id is not found", async () => {
    // First query fails
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found" }
    });
    
    // Second query succeeds with shortened id
    mockSupabase.single.mockResolvedValueOnce({
      data: { api_key: apiKey },
      error: null
    });

    const result = await getApiKeyFromFolio(idMensajeCobro, mockSupabase);

    expect(result).toBe(apiKey);
    expect(mockSupabase.from).toHaveBeenCalledWith("folios_codi");
    expect(mockSupabase.select).toHaveBeenCalledWith("api_key");
    expect(mockSupabase.eq).toHaveBeenCalledTimes(2);
    expect(mockSupabase.eq).toHaveBeenNthCalledWith(1, "folio_codi", idMensajeCobro);
    expect(mockSupabase.eq).toHaveBeenNthCalledWith(2, "folio_codi", idMensajeCobro.substring(0, 10));
    expect(mockSupabase.single).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenCalledWith("No record found for full idMensajeCobro, trying first 10 characters");
  });

  it("should return null if API key is not found with shortened idMensajeCobro", async () => {
    // First query fails
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found" }
    });
    
    // Second query fails too
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Not found" }
    });

    const result = await getApiKeyFromFolio(idMensajeCobro, mockSupabase);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error querying folios_codi with shortened idMensajeCobro:", { message: "Not found" });
  });

  it("should return null if folioData exists but api_key is null", async () => {
    mockSupabase.single.mockResolvedValue({
      data: { api_key: null },
      error: null
    });

    const result = await getApiKeyFromFolio(idMensajeCobro, mockSupabase);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(`No api_key found for idMensajeCobro: ${idMensajeCobro}`);
  });

  it("should handle unexpected errors", async () => {
    const error = new Error("Unexpected error");
    mockSupabase.from.mockImplementation(() => {
      throw error;
    });

    const result = await getApiKeyFromFolio(idMensajeCobro, mockSupabase);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error retrieving API key:", error.message);
  });
});
