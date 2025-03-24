// Home Routes
// ===========

// Imports
// *******
// Express & router object
const express = require("express");
const router = express.Router();

// Controllers
const qr = require("../controllers/sendQrPayment");
const push = require("../controllers/sendPushPayment");
const consulta = require("../controllers/consulta");
const resultado = require("../controllers/resultadoOperaciones");

// Routes
// ******
router.post("/codi/qr", qr.sendQrPayment);
router.post("/codi/push", push.sendPushPayment);
router.post("/codi/consulta", consulta.getBillingInfo);
router.post("/v2/resultadoOperaciones", resultado.resultadoOperaciones);

// Exports
// *******
module.exports = router;
