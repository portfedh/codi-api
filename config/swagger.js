/**
 * @fileoverview Configuration for Swagger API documentation.
 * This file sets up Swagger options and generates the Swagger documentation
 * for the CoDi API.
 */

const swaggerJsDoc = require("swagger-jsdoc");

/**
 * Swagger configuration options.
 * @type {import('swagger-jsdoc').Options}
 */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      /**
       * API metadata.
       * @property {string} title - The title of the API.
       * @property {string} version - The version of the API.
       * @property {string} description - A brief description of the API.
       * @property {Object} contact - Contact information for API support.
       * @property {Object} license - License information for the API.
       */
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
      /**
       * List of servers where the API is hosted.
       * @property {string} url - The server URL.
       * @property {string} description - A description of the server.
       */
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
      /**
       * Security schemes and reusable schemas for the API.
       */
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key authentication",
        },
      },
      schemas: {
        /**
         * Error response schema.
         * @property {string} message - Error message.
         * @property {string} code - Error code.
         */
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
        /**
         * Success response schema.
         * @property {boolean} success - Indicates if the operation was successful.
         * @property {string} message - Success message.
         */
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
      /**
       * Tags for categorizing API endpoints.
       * @property {string} name - The name of the tag.
       * @property {string} description - A description of the tag.
       */
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

/**
 * Generate Swagger documentation using the defined options.
 * @type {import('swagger-jsdoc').SwaggerDefinition}
 */
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
