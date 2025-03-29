// Home Routes
// ===========

// Imports
// *******
// Express & router object
const express = require("express");
const router = express.Router();

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

/**
 * @swagger
 * /v2/codi/qr:
 *   post:
 *     summary: Generate QR code payment
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
 *               concept:
 *                 type: string
 *                 description: Payment concept or description
 *               reference:
 *                 type: string
 *                 description: Payment reference
 *     responses:
 *       200:
 *         description: QR Payment generated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Invalid API key
 *       500:
 *         description: Server error
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
 *               accountNumber:
 *                 type: string
 *                 description: Target account number
 *               concept:
 *                 type: string
 *                 description: Payment concept
 *     responses:
 *       200:
 *         description: Push Payment sent successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Invalid API key
 *       500:
 *         description: Server error
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
 *     responses:
 *       200:
 *         description: Billing information retrieved successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Invalid API key
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
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
