const { validateApiKey } = require("../middleware/validateApiKey");
const { getSellerApiKey } = require("../controllers/utils/getSellerApiKey");

// Mock getSellerApiKey function
jest.mock("../controllers/utils/getSellerApiKey");

describe("validateApiKey Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();

    // Setup request, response, and next function mocks
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    // Mock the getSellerApiKey function to return a test value
    getSellerApiKey.mockReturnValue("test-api-key");
  });

  test("should call next() when a valid API key is provided", () => {
    req.headers["x-api-key"] = "test-api-key";

    validateApiKey(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("should return 401 when no API key is provided", () => {
    validateApiKey(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Invalid or missing API key",
    });
  });

  test("should return 401 when an invalid API key is provided", () => {
    req.headers["x-api-key"] = "wrong-api-key";

    validateApiKey(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Invalid or missing API key",
    });
  });
});
