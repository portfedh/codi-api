const { validationResult } = require("express-validator");

/**
 * Middleware to validate the request using express-validator.
 * If validation errors are found, it responds with a 400 status and the errors.
 * Otherwise, it proceeds to the next middleware.
 *
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Exports the validateRequest middleware.
 */
module.exports = {
  validateRequest,
};
