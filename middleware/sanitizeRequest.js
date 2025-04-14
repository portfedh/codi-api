const { sanitizeBody } = require("express-validator");

/**
 * Middleware to sanitize incoming request data (body, params, query).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function sanitizeRequest(req, res, next) {
  // Sanitize req.body
  if (req.body) {
    sanitizeRecursively(req.body);
  }

  // Sanitize req.params
  if (req.params) {
    sanitizeRecursively(req.params);
  }

  // Sanitize req.query
  if (req.query) {
    sanitizeRecursively(req.query);
  }

  next();
}

/**
 * Recursively sanitizes an object by removing script tags, HTML entities, and other potentially harmful content.
 * @param {Object} obj - The object to sanitize.
 */
function sanitizeRecursively(obj) {
  if (!obj || typeof obj !== "object") {
    return;
  }

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "string") {
      // Sanitize strings - remove script tags, HTML entities, etc.
      obj[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === "object") {
      // Recursively sanitize nested objects
      sanitizeRecursively(obj[key]);
    }
  });
}

/**
 * Sanitizes a string by removing script tags, HTML tags, and encoding special characters.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
function sanitizeString(str) {
  // Remove script tags completely
  let sanitized = str.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove HTML tags (keep text content)
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Encode remaining special characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  // Additional sanitization as needed for your specific use case

  return sanitized;
}

module.exports = { sanitizeRequest };
