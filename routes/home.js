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
const recepcion = require("../controllers/recepcion");

// Routes
// ******
router.get("/send-qr-payment", qr.sendQrPayment);
router.get("/send-push-payment", push.sendPushPayment);
router.get("/consultaOperaciones", consulta.getBillingInfo);
router.get("/v2/resultadoOperaciones", recepcion.logRequestData);

// Exports
// *******
module.exports = router;
