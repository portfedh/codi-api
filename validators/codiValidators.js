const { body, validationResult } = require("express-validator");

const qrValidationRules = [
  body("monto")
    .isFloat({ gt: 0 })
    .withMessage("Monto must be a positive number"),
  body("referenciaNumerica")
    .isString()
    .isLength({ min: 1 })
    .withMessage("ReferenciaNumerica is required"),
  body("concepto").isString().withMessage("Concepto must be a string"),
  body("vigencia")
    .isInt({ min: 0 })
    .withMessage("Vigencia must be a non-negative integer"),
];

const pushValidationRules = [
  body("celularCliente")
    .isString()
    .isLength({ min: 10, max: 10 })
    .withMessage("CelularCliente must be a 10-digit string"),
  body("monto")
    .isFloat({ gt: 0 })
    .withMessage("Monto must be a positive number"),
  body("referenciaNumerica")
    .isString()
    .isLength({ min: 1 })
    .withMessage("ReferenciaNumerica is required"),
  body("concepto").isString().withMessage("Concepto must be a string"),
  body("vigencia")
    .isInt({ min: 0 })
    .withMessage("Vigencia must be a non-negative integer"),
];

const consultaValidationRules = [
  body("folioCodi")
    .isString()
    .isLength({ min: 1 })
    .withMessage("FolioCodi is required"),
  body("fechaInicial")
    .isISO8601()
    .withMessage("FechaInicial must be a valid date"),
  body("fechaFinal").isISO8601().withMessage("FechaFinal must be a valid date"),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  qrValidationRules,
  pushValidationRules,
  consultaValidationRules,
  validateRequest,
};
