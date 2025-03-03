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
router.post("/codi/qr", qr.sendQrPayment);
router.post("/codi/push", push.sendPushPayment);
router.post("/codi/consulta", consulta.getBillingInfo);
router.get("/v2/resultadoOperaciones", recepcion.logRequestData);

// Exports
// *******
module.exports = router;
