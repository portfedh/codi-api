const { sanitizeBody } = require("express-validator");

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
