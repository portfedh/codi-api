const swaggerDocs = require("../config/swagger");
const { describe, it, expect } = require("@jest/globals");

describe("Swagger Configuration", () => {
  it("should have the correct API metadata", () => {
    expect(swaggerDocs.info.title).toBe("CoDi API");
    expect(swaggerDocs.info.version).toBe("2.0.0");
    expect(swaggerDocs.info.description).toBe(
      "API documentation for payment operations using CoDi"
    );
    expect(swaggerDocs.info.contact).toEqual({
      name: "API Support",
      email: "support@example.com",
    });
    expect(swaggerDocs.info.license).toEqual({
      name: "Private",
      url: "https://example.com/license",
    });
  });

  it("should define the correct servers", () => {
    expect(swaggerDocs.servers).toEqual([
      {
        url: "http://localhost:3131",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ]);
  });

  it("should define the correct security schemes", () => {
    expect(swaggerDocs.components.securitySchemes).toEqual({
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description: "API key authentication",
      },
    });
  });

  it("should define the correct schemas", () => {
    expect(swaggerDocs.components.schemas).toHaveProperty("Error");
    expect(swaggerDocs.components.schemas.Error).toEqual({
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Error message",
        },
        code: {
          type: "string",
          description: "Error code",
        },
      },
    });

    expect(swaggerDocs.components.schemas).toHaveProperty("SuccessResponse");
    expect(swaggerDocs.components.schemas.SuccessResponse).toEqual({
      type: "object",
      properties: {
        success: {
          type: "boolean",
          description: "Indicates if operation was successful",
          example: true,
        },
        message: {
          type: "string",
          description: "Success message",
        },
      },
    });
  });

  it("should define the correct tags", () => {
    expect(swaggerDocs.tags).toEqual([
      {
        name: "CODI Payments",
        description: "Endpoints for payment operations",
      },
      {
        name: "CODI Information",
        description: "Endpoints for retrieving information",
      },
      {
        name: "Operations",
        description: "Endpoints for processing operation results",
      },
    ]);
  });
});
