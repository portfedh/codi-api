// Home Routes
// ===========

// Imports
// *******
// Express & router object
const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../config/swagger");

// Middleware
const { validateApiKey } = require("../middleware/validateApiKey");

// Controllers
const health = require("../controllers/health");
const qr = require("../controllers/sendQrPayment");
const consulta = require("../controllers/consulta");
const push = require("../controllers/sendPushPayment");
const resultado = require("../controllers/resultadoOperaciones");

// Validators
const { qrValidationRules } = require("../validators/qrValidationRules");
const { pushValidationRules } = require("../validators/pushValidationRules");
const {
  consultaValidationRules,
} = require("../validators/consultaValidationRules");
const { validateRequest } = require("../validators/validateRequest");

// Routes
// ******

// Swagger Documentation
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /v2/health:
 *   get:
 *     summary: Health Check Endpoint
 *     description: Checks the health of the API system including server status and database connectivity.
 *     tags: [System]
 *     responses:
 *       '200':
 *         description: All systems operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Overall health status
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Time of the health check
 *                   example: "2023-07-24T15:30:45Z"
 *                 services:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "healthy"
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "healthy"
 *                         responseTime:
 *                           type: number
 *                           description: Database response time in milliseconds
 *                           example: 45
 *       '503':
 *         description: Service Unavailable - One or more components are not functioning properly.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "unhealthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-07-24T15:30:45Z"
 *                 services:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "healthy"
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "unhealthy"
 *                         error:
 *                           type: string
 *                           example: "Database connection failed"
 */
router.get("/v2/health", health.checkHealth);

/**
 * @swagger
 * /v2/codi/qr:
 *   post:
 *     summary: Generate CoDi QR Payment Request
 *     description: Creates a QR code representing a CoDi payment request. This QR code can be scanned by a payer's mobile banking app to initiate the payment.
 *     tags: [CoDi Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-f]{128}$'
 *         description: 128-character hexadecimal API key for authentication
 *     requestBody:
 *       required: true
 *       description: Details of the payment request for generating the QR code.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto
 *               - referenciaNumerica
 *               - concepto
 *               - vigencia
 *             properties:
 *               monto:
 *                 type: number
 *                 format: float
 *                 description: |
 *                   Payment amount. 
 *                   - Value can be an integer or float with up to two decimals or a string
 *                   - Range: 0.01 to 999,999,999,999.99
 *                   - If value is 0, the user must determine the amount when authorizing payment
 *                   - Current bank limits: minimum 0.01, maximum 12,000
 *                 example: 99.03
 *               referenciaNumerica:
 *                 type: string
 *                 description: |
 *                   Transaction identifier assigned by the seller.
 *                   - Can be an integer or a string
 *                   - Length must be between 1-7 characters
 *                   - If string, only digits (0-9) are allowed
 *                   - Use 0 if no value is assigned
 *                 pattern: '^[0-9]{1,7}$'
 *                 example: "1234567"
 *               concepto:
 *                 type: string
 *                 description: |
 *                   Payment description or concept.
 *                   - Required field, cannot be empty
 *                   - Length must be between 1-40 characters
 *                   - Only ASCII characters are allowed
 *                 minLength: 1
 *                 maxLength: 40
 *                 example: "Boleto de evento mensual"
 *               vigencia:
 *                 type: string
 *                 description: |
 *                   Payment expiration timestamp.
 *                   - Can be a string or integer
 *                   - Maximum 15 characters
 *                   - Unix timestamp (seconds since January 1, 1970 UTC)
 *                   - Use 0 for no expiration date
 *                 pattern: '^[0-9]{1,15}$'
 *                 example: "0"
 *     responses:
 *       '200':
 *         description: QR Payment Request generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCode:
 *                   type: string
 *                   description: Base64 encoded string of the QR code image (PNG format). Can be used directly in an `<img>` tag `src` attribute.
 *                   example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *                 data:
 *                   type: object
 *                   properties:
 *                     cadenaMC:
 *                       type: string
 *                       description: Encrypted payment information string containing transaction details.
 *                       example: "{\"TYP\":20,\"v\":{\"DEV\":\"29442719514356328128/0\"},\"ic\":{\"IDC\":\"32af20f42e\",\"SER\":43511855,\"ENC\":\"dbRCrzAln/1VhCh7o6MqwJjYtC2ouu7e8oP2Qx6P0LnPx1DDZp8CHuODHYg8YeWPM0OuFXdnaxW+QpvdzzMvsmKQdui7ItgfsLZEU3FbYDVoEKIjEZVZXlzRZc6eiEAKgoz+bQjmSMKcww/i8GP1XEy9rNtuAAPpscp6bomNhHzzGRi/JWmMpbKHwpYnnz+Rju7tDdtL3rhKccejAGwdJAsdyAVE0Xy3fG4xIIVCAoEQ0MbffiFb7fIs877i1+YtHqxSfP8/EgZ2CHesLdx0p51VQxmriQtWXNhts24e4Rp6f4xaOn/ayA4Xs4c24azCp+rnM4t7rY2oo24fDTUo/w==\"},\"CRY\":\"xHmsNgksCo5t4wDtnUwj9eIplwEdjEkTaGdnEvFyEz8=\"}"
 *                     crtBdeM:
 *                       type: string
 *                       description: Banxico public certificate identifier.
 *                       example: "00000100000100015975"
 *                     selloDigital:
 *                       type: string
 *                       description: Digital signature of the response by Banxico.
 *                       example: "HWjD3bPwJ+rfDnDYc8UJt2fmJvFAl9LPpyNMUrowSzDCjxewGSeLN+u4M2cZ7jszbQofaIrsTiVu/VHBdewX1GkoChQ5sUUB6lk3dlT2iXmvuwOdM9ex1DIXRJYyGz9nwJMz1e6Fxx6eKfgEbSuMDbpk55cRKvyuyPeQmRxJi9G5sHISZcgHrK+n/DKAl/1ng4n7xCQnbsApT/+FcUAD46X43z0CZSaxrVtWdAM9u06iPOXiaW0yJBbM6PaxGpM+evYBD2IopYXmdjgl24Bcme5RGkNFHl28OPsRbSPBSy4ORjCA7sOh8bab6/iaDI1XHG2nKs37LZDCDK7AcGibunEciFuvio9WEJ2qoQPfZ5B6miCzRM0dI+4UjFy8GdVl9eAu5jnMgc9alIRamDpJkA=="
 *                     epoch:
 *                       type: integer
 *                       description: Timestamp of the operation.
 *                       example: 1743120460060
 *                     edoPet:
 *                       type: integer
 *                       description: |
 *                         Status of the request.
 *                         - 0: Success
 *                         - -1: Error, missing information
 *                         - -2: Error, processing
 *                         - -3: Error, input parameters
 *                         - -4: Error, invalid signature
 *                       example: 0
 *       '400':
 *         description: Bad Request - The request body is missing required fields or contains invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized - The provided API key is missing, invalid, or does not have permission to perform this operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the API key issue
 *                   example: "Invalid API Key"
 *             examples:
 *               missingApiKey:
 *                 summary: Missing API Key
 *                 value:
 *                   error: "API Key missing"
 *               invalidApiKey:
 *                 summary: Invalid API Key
 *                 value:
 *                   error: "Invalid API Key"
 *       '500':
 *         description: Internal Server Error - An unexpected error occurred on the server while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error processing QR request"
 *             examples:
 *               serverError:
 *                 summary: Generic server error
 *                 value:
 *                   success: false
 *                   error: "Error processing QR request"
 */
router.post(
  "/v2/codi/qr",
  validateApiKey,
  qrValidationRules,
  validateRequest,
  qr.sendQrPayment
);

/**
 * @swagger
 * /v2/codi/push:
 *   post:
 *     summary: Initiate CoDi Push Payment Request
 *     description: >
 *       Sends a payment request notification directly to a payer's mobile banking app using their phone number or CLABE account number.
 *       The payer must approve the request in their app.
 *     tags: [CoDi Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       description: Details of the push payment request.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - accountNumber
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The exact amount to be requested. Must be a positive number.
 *                 example: 500.75
 *               accountNumber:
 *                 type: string
 *                 description: >
 *                   The target payer's identifier, which could be a 10-digit cell phone number or an 18-digit CLABE account number associated with CoDi.
 *                 example: "5512345678"
 *               concept:
 *                 type: string
 *                 description: A brief description of the payment request. Max length typically enforced by downstream systems.
 *                 example: "Monthly subscription fee"
 *               reference:
 *                 type: string
 *                 description: A unique reference identifier for the payment request, useful for reconciliation. Max length typically enforced by downstream systems.
 *                 example: "SUB-JULY-2024"
 *           examples:
 *             pushToPhone:
 *               summary: Push Request via Phone Number
 *               description: Sending a request using the payer's phone number.
 *               value:
 *                 amount: 350.00
 *                 accountNumber: "5598765432"
 *                 concept: "Service Payment"
 *             pushToClabe:
 *               summary: Push Request via CLABE
 *               description: Sending a request using the payer's CLABE account.
 *               value:
 *                 amount: 750.25
 *                 accountNumber: "018123456789012345"
 *                 concept: "Invoice #INV-002 Payment"
 *                 reference: "REF-INV-002"
 *     responses:
 *       '200':
 *         description: >
 *           Push Payment Request initiated successfully. Note: This indicates the request was sent, not that the payment is complete.
 *           Payment status needs to be checked separately or via webhook.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the push request was successfully initiated.
 *                   example: true
 *                 operationId:
 *                   type: string
 *                   description: A unique identifier assigned to this specific push payment request operation. Used for tracking and status updates.
 *                   example: "PUSH-OP-f6e5d4c3b2a1"
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the request was sent.
 *                   example: "Push payment request sent successfully to the payer."
 *       '400':
 *         description: Bad Request - The request body is missing required fields or contains invalid data (e.g., invalid amount, invalid account number format).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidAccountNumber:
 *                 summary: Invalid Account Number
 *                 value:
 *                   message: "Validation Error: Invalid account number format. Must be 10-digit phone or 18-digit CLABE."
 *                   errors: [{ "field": "accountNumber", "message": "Invalid account number format. Must be 10-digit phone or 18-digit CLABE." }]
 *               missingAmount:
 *                 summary: Missing Amount
 *                 value:
 *                   message: "Validation Error: 'amount' is required."
 *                   errors: [{ "field": "amount", "message": "'amount' is required" }]
 *       '401':
 *         description: Unauthorized - The provided API key is missing, invalid, or lacks permission.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid API Key"
 *               code: "UNAUTHORIZED"
 *       '500':
 *         description: Internal Server Error - An unexpected error occurred while trying to initiate the push request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Failed to initiate push payment due to an internal error"
 *               code: "INTERNAL_SERVER_ERROR"
 */
router.post(
  "/v2/codi/push",
  validateApiKey,
  pushValidationRules,
  validateRequest,
  push.sendPushPayment
);

/**
 * @swagger
 * /v2/codi/consulta:
 *   post:
 *     summary: Query CoDi Operation Status
 *     description: Retrieves the current status and details of a previously initiated CoDi operation (QR or Push) using its unique operation ID.
 *     tags: [CoDi Information]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       description: The unique identifier of the operation to query.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - operationId # Changed from transactionId to operationId for consistency
 *             properties:
 *               operationId:
 *                 type: string
 *                 description: The unique ID returned when the QR or Push payment request was created.
 *                 example: "QR-OP-a1b2c3d4e5f6"
 *           examples:
 *             queryOperation:
 *               summary: Query Operation Status
 *               value:
 *                 operationId: "PUSH-OP-f6e5d4c3b2a1"
 *     responses:
 *       '200':
 *         description: Operation status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 operation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The operation ID queried.
 *                       example: "QR-OP-a1b2c3d4e5f6"
 *                     type:
 *                       type: string
 *                       description: Type of the operation (e.g., QR, PUSH).
 *                       enum: [QR, PUSH]
 *                       example: "QR"
 *                     amount:
 *                       type: number
 *                       format: float
 *                       description: The amount associated with the operation.
 *                       example: 100.50
 *                     status:
 *                       type: string
 *                       description: The current status of the payment operation.
 *                       enum: [PENDING, COMPLETED, REJECTED, CANCELLED, EXPIRED]
 *                       example: "COMPLETED"
 *                     creationTimestamp:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the operation was created.
 *                       example: "2023-10-26T10:00:00Z"
 *                     lastUpdateTimestamp:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the operation status was last updated.
 *                       example: "2023-10-26T10:05:30Z"
 *                     # Add other relevant fields like concept, reference, payerInfo if available
 *       '400':
 *         description: Bad Request - The request body is missing the operation ID or it's in an invalid format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Validation Error: 'operationId' is required."
 *               errors: [{ "field": "operationId", "message": "'operationId' is required" }]
 *       '401':
 *         description: Unauthorized - Invalid API key.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid API Key"
 *               code: "UNAUTHORIZED"
 *       '404':
 *         description: Not Found - The specified operation ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Operation not found"
 *               code: "OPERATION_NOT_FOUND"
 *       '500':
 *         description: Internal Server Error - An error occurred while querying the operation status.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Failed to retrieve operation status due to an internal error"
 *               code: "INTERNAL_SERVER_ERROR"
 */
router.post(
  "/v2/codi/consulta",
  validateApiKey,
  consultaValidationRules, // Ensure this validator checks for 'operationId' now
  validateRequest,
  consulta.getBillingInfo
);

/**
 * @swagger
 * /v2/resultadoOperaciones:
 *   post:
 *     summary: Receive CoDi Operation Result Callback (Webhook)
 *     description: Endpoint designed to receive asynchronous notifications (webhooks) from the CoDi processor about the final status of a payment operation (e.g., completed, rejected). This endpoint should not typically be called directly by API consumers but configured as a callback URL.
 *     tags: [Operations Webhook] # Changed tag for clarity
 *     # No security definition here if it's a webhook called by an external system (authentication might be handled differently, e.g., signature verification in the controller)
 *     requestBody:
 *       required: true
 *       description: Payload containing the result of a CoDi operation. The exact structure depends on the CoDi provider.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - operationId
 *               - status
 *             properties:
 *               operationId:
 *                 type: string
 *                 description: The unique ID of the operation whose status is being reported.
 *                 example: "QR-OP-a1b2c3d4e5f6"
 *               status:
 *                 type: string
 *                 description: The final status of the operation.
 *                 enum: [COMPLETED, REJECTED, CANCELLED] # Final states typically reported
 *                 example: "COMPLETED"
 *               timestamp:
 *                  type: string
 *                  format: date-time
 *                  description: Timestamp when the status update occurred.
 *                  example: "2023-10-26T10:05:30Z"
 *               details:
 *                 type: object
 *                 description: Additional details about the result (e.g., rejection reason, transaction confirmation ID). Structure varies.
 *                 example: { "confirmationId": "CONF-12345", "message": "Payment successful" }
 *               # Potentially add signature fields if webhook signature verification is used
 *           examples:
 *             operationCompleted:
 *               summary: Successful Operation Callback
 *               value:
 *                 operationId: "QR-OP-a1b2c3d4e5f6"
 *                 status: "COMPLETED"
 *                 timestamp: "2023-10-26T10:05:30Z"
 *                 details: { "confirmationId": "SP-XYZ-789" }
 *             operationRejected:
 *               summary: Rejected Operation Callback
 *               value:
 *                 operationId: "PUSH-OP-f6e5d4c3b2a1"
 *                 status: "REJECTED"
 *                 timestamp: "2023-10-26T11:15:00Z"
 *                 details: { "rejectionCode": "05", "rejectionReason": "Insufficient funds" }
 *     responses:
 *       '200':
 *         description: Callback received and acknowledged successfully. The body might be empty or contain a simple success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Callback received."
 *       '400':
 *         description: Bad Request - The callback payload is malformed, missing required fields, or fails validation (e.g., invalid signature if applicable).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *                message: "Invalid callback payload"
 *                code: "INVALID_CALLBACK"
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the callback.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *                message: "Error processing operation result"
 *                code: "CALLBACK_PROCESSING_ERROR"
 */
router.post("/v2/resultadoOperaciones", resultado.resultadoOperaciones);

// Exports
// *******
module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A human-readable error message.
 *         code:
 *           type: string
 *           description: An optional machine-readable error code.
 *           example: "INVALID_INPUT"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: The field that caused the validation error.
 *               message:
 *                 type: string
 *                 description: Specific error message for the field.
 *           description: An array of validation errors (present for 400 errors).
 *     SuccessResponse: # Added a generic success response schema
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful.
 *           example: true
 *         message:
 *           type: string
 *           description: An optional success message.
 *           example: "Operation completed successfully."
 *   securitySchemes:
 *     ApiKeyAuth: # Define the security scheme used in routes
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY # Or wherever your API key is expected
 *       description: API Key for authentication. Obtain your key from the developer portal.
 */
