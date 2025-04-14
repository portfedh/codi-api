const { checkHealth } = require("../controllers/health");
const supabase = require("../config/supabase");

jest.mock("../config/supabase");

describe("Health Check API", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {}; // Mock request object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }; // Mock response object
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and healthy status when all services are healthy", async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest
          .fn()
          .mockResolvedValue({ data: [{ count: 1 }], error: null }),
      }),
    });

    await checkHealth(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "healthy",
        services: {
          server: { status: "healthy" },
          database: expect.objectContaining({
            status: "healthy",
            responseTime: expect.any(Number),
          }),
        },
      })
    );
  });

  it("should return 503 and unhealthy status when the database query fails", async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      }),
    });

    await checkHealth(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "unhealthy",
        services: {
          server: { status: "healthy" },
          database: expect.objectContaining({
            status: "unhealthy",
            error: "Database error",
          }),
        },
      })
    );
  });

  it("should return 503 and unhealthy status when an unexpected error occurs", async () => {
    supabase.from.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    await checkHealth(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "unhealthy",
        services: {
          server: { status: "healthy" },
          database: expect.objectContaining({
            status: "unhealthy",
            error: "Unexpected error",
          }),
        },
      })
    );
  });
});
