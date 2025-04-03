// Home Routes
// ===========

// Imports
// *******
// Express & router object
const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../config/swagger");
const supabase = require("../config/supabase");

// Middleware
const { validateApiKey } = require("../middleware/validateApiKey");

// Controllers
const qr = require("../controllers/sendQrPayment");
const push = require("../controllers/sendPushPayment");
const consulta = require("../controllers/consulta");
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

// Supabase Test Route
router.get("/test-db", async (req, res) => {
  try {
    // Get the table name from query params or use default
    const tableName = req.query.table || "users";

    // Log the query we're about to make
    console.log(`Querying table: ${tableName}`);

    const { data, error } = await supabase.from(tableName).select("*").limit(5);

    if (error) throw error;

    res.json({
      message: "Successfully connected to Supabase!",
      data: data,
    });
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    res.status(500).json({
      message: "Failed to connect to Supabase",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /v2/codi/qr:
 *   post:
 *     summary: Generate QR code payment
 *     description: Creates a QR code for CoDi payment processing
 *     tags: [CODI Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *                 example: 100.50
 *               concept:
 *                 type: string
 *                 description: Payment concept or description
 *                 example: "Invoice payment"
 *               reference:
 *                 type: string
 *                 description: Payment reference
 *                 example: "INV-2023-001"
 *           examples:
 *             basicPayment:
 *               summary: Basic payment
 *               value:
 *                 amount: 150
 *             fullPayment:
 *               summary: Payment with all fields
 *               value:
 *                 amount: 245.75
 *                 concept: "Office supplies"
 *                 reference: "REF123456"
 *     responses:
 *       200:
 *         description: QR Payment generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 qrCode:
 *                   type: string
 *                   description: Base64 encoded QR code image
 *                 operationId:
 *                   type: string
 *                   description: Unique ID for the operation
 *                   example: "QR-12345-67890"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidAmount:
 *                 summary: Invalid amount
 *                 value:
 *                   message: "Amount must be a positive number"
 *                   code: "INVALID_AMOUNT"
 *       401:
 *         description: Unauthorized - Invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Send push payment notification
 *     description: Sends a payment notification to a specific account
 *     tags: [CODI Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
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
 *                 description: Payment amount
 *                 example: 500.75
 *               accountNumber:
 *                 type: string
 *                 description: Target account number
 *                 example: "012345678901234567"
 *               concept:
 *                 type: string
 *                 description: Payment concept
 *                 example: "Monthly service fee"
 *           examples:
 *             basicPush:
 *               summary: Basic push payment
 *               value:
 *                 amount: 350
 *                 accountNumber: "018123456789012345"
 *             fullPush:
 *               summary: Push with concept
 *               value:
 *                 amount: 750.25
 *                 accountNumber: "018123456789012345"
 *                 concept: "Subscription renewal"
 *     responses:
 *       200:
 *         description: Push Payment sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transactionId:
 *                   type: string
 *                   description: Transaction identifier
 *                   example: "PUSH-98765-43210"
 *                 message:
 *                   type: string
 *                   example: "Push payment sent successfully"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidAccount:
 *                 summary: Invalid account number
 *                 value:
 *                   message: "Invalid account number format"
 *                   code: "INVALID_ACCOUNT"
 *       401:
 *         description: Unauthorized - Invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     summary: Get billing information
 *     description: Retrieves information about a specific transaction
 *     tags: [CODI Information]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: ID of the transaction to query
 *                 example: "TX-2023-12345"
 *           examples:
 *             basicQuery:
 *               summary: Basic transaction query
 *               value:
 *                 transactionId: "TX-2023-12345"
 *     responses:
 *       200:
 *         description: Billing information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "TX-2023-12345"
 *                     amount:
 *                       type: number
 *                       example: 250.00
 *                     status:
 *                       type: string
 *                       example: "COMPLETED"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-04-15T14:30:45Z"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Transaction not found"
 *               code: "TX_NOT_FOUND"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/v2/codi/consulta",
  validateApiKey,
  consultaValidationRules,
  validateRequest,
  consulta.getBillingInfo
);

/**
 * @swagger
 * /resultadoOperaciones:
 *   post:
 *     summary: Process operation results
 *     description: Handles callbacks with operation results (legacy endpoint)
 *     tags: [Operations]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
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
 *                 description: ID of the operation
 *                 example: "OP-2023-78901"
 *               status:
 *                 type: string
 *                 description: Status of the operation
 *                 enum: [COMPLETED, REJECTED, PENDING]
 *                 example: "COMPLETED"
 *               details:
 *                 type: object
 *                 description: Additional operation details
 *           examples:
 *             successfulOperation:
 *               summary: Successful operation
 *               value:
 *                 operationId: "OP-2023-78901"
 *                 status: "COMPLETED"
 *             failedOperation:
 *               summary: Failed operation
 *               value:
 *                 operationId: "OP-2023-78902"
 *                 status: "REJECTED"
 *     responses:
 *       200:
 *         description: Operation results processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /v2/resultadoOperaciones:
 *   post:
 *     summary: Process operation results (v2)
 *     description: Handles callbacks with operation results (current version)
 *     tags: [Operations]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
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
 *                 description: ID of the operation
 *                 example: "OP-2023-78901"
 *               status:
 *                 type: string
 *                 description: Status of the operation
 *                 enum: [COMPLETED, REJECTED, PENDING, CANCELLED]
 *                 example: "COMPLETED"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Time when the operation status changed
 *                 example: "2023-04-15T14:30:45Z"
 *               details:
 *                 type: object
 *                 description: Additional operation details
 *           examples:
 *             successfulOperation:
 *               summary: Successful operation
 *               value:
 *                 operationId: "OP-2023-78901"
 *                 status: "COMPLETED"
 *                 timestamp: "2023-04-15T14:30:45Z"
 *             failedOperation:
 *               summary: Failed operation
 *               value:
 *                 operationId: "OP-2023-78902"
 *                 status: "REJECTED"
 *                 timestamp: "2023-04-15T14:35:22Z"
 *                 details:
 *                   reason: "Insufficient funds"
 *                   code: "INS_FUNDS"
 *     responses:
 *       200:
 *         description: Operation results processed successfully
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
 *                   example: "Operation result processed successfully"
 *                 processingId:
 *                   type: string
 *                   description: ID of the processing job
 *                   example: "PROC-12345"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidOperation:
 *                 summary: Invalid operation ID
 *                 value:
 *                   message: "Operation not found"
 *                   code: "OP_NOT_FOUND"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/resultadoOperaciones", resultado.resultadoOperaciones);

/**
 * @swagger
 * /v2/resultadoOperaciones:
 *   post:
 *     summary: Process operation results (v2)
 *     tags: [Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operationId:
 *                 type: string
 *                 description: ID of the operation
 *               status:
 *                 type: string
 *                 description: Status of the operation
 *     responses:
 *       200:
 *         description: Operation results processed successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/v2/resultadoOperaciones", resultado.resultadoOperaciones);

// Exports
// *******
module.exports = router;
