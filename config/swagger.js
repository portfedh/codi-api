const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CoDi API",
      version: "2.0.0",
      description: "API documentation for payment operations using CoDi",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "Private",
        url: "https://example.com/license",
      },
    },
    servers: [
      {
        url: "http://localhost:3131",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key authentication",
        },
      },
      schemas: {
        Error: {
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
        },
        SuccessResponse: {
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
        },
      },
    },
    tags: [
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
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
