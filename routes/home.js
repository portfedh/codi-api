// Home Routes
// ===========

// Imports
// *******
// Express & router object
const express = require("express");
const router = express.Router();

// Controllers
const ctrl = require("../controllers/temp");

// Routes
// ******
router.get("/", ctrl.temp);

// Exports
// *******
module.exports = router;
