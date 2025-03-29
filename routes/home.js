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
router.post(
  "/v2/codi/qr",
  // validateApiKey,
  qrValidationRules,
  validateRequest,
  qr.sendQrPayment
);
router.post(
  "/v2/codi/push",
  // validateApiKey,
  pushValidationRules,
  validateRequest,
  push.sendPushPayment
);
router.post(
  "/v2/codi/consulta",
  // validateApiKey,
  consultaValidationRules,
  validateRequest,
  consulta.getBillingInfo
);
router.post(
  "/resultadoOperaciones",
  // validateApiKey,
  resultado.resultadoOperaciones
);
router.post(
  "/v2/resultadoOperaciones",
  // validateApiKey,
  resultado.resultadoOperaciones
);

// Exports
// *******
module.exports = router;
