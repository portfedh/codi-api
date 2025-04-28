const { validateApiKey } = require("../middleware/validateApiKey");
const supabase = require("../config/supabase");
const apiKeyCache = require("../config/cache");

jest.mock("../config/supabase");
jest.mock("../config/cache");

describe("validateApiKey middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    apiKeyCache.get.mockClear();
    apiKeyCache.set.mockClear();
    supabase.from.mockClear();
  });

  it("should return 401 if API key is missing", async () => {
    await validateApiKey(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "API Key missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should use cached API key if available", async () => {
    req.headers["x-api-key"] = "test-key";
    apiKeyCache.get.mockReturnValue({ banxico_api_key: "cached-key" });

    await validateApiKey(req, res, next);

    expect(apiKeyCache.get).toHaveBeenCalledWith("test-key");
    expect(req.apiKey).toBe("cached-key");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if API key is invalid", async () => {
    req.headers["x-api-key"] = "invalid-key";
    apiKeyCache.get.mockReturnValue(null);
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ error: true, data: null }),
    });

    await validateApiKey(req, res, next);

    expect(apiKeyCache.get).toHaveBeenCalledWith("invalid-key");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid API Key" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should query Supabase and cache the result if API key is valid", async () => {
    req.headers["x-api-key"] = "valid-key";
    apiKeyCache.get.mockReturnValue(null);
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        error: null,
        data: { banxico_api_key: "supabase-key" },
      }),
    });

    await validateApiKey(req, res, next);

    expect(apiKeyCache.get).toHaveBeenCalledWith("valid-key");
    expect(supabase.from).toHaveBeenCalledWith("api_keys");
    expect(apiKeyCache.set).toHaveBeenCalledWith("valid-key", {
      banxico_api_key: "supabase-key",
    });
    expect(req.apiKey).toBe("supabase-key");
    expect(next).toHaveBeenCalled();
  });
});
