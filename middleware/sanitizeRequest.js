const sanitizeHtml = require("sanitize-html");

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
 * Sanitizes a string by removing all HTML tags and encoding special characters.
 * Uses sanitize-html library to properly parse and remove HTML tags, preventing
 * bypass vulnerabilities that can occur with regex-based approaches.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
function sanitizeString(str) {
  // Use sanitize-html library to strip ALL HTML tags
  // This properly handles nested tags, malformed HTML, and edge cases
  // that regex-based approaches can miss
  const sanitized = sanitizeHtml(str, {
    allowedTags: [], // No tags allowed - strip everything
    allowedAttributes: {}, // No attributes allowed
    disallowedTagsMode: "discard", // Remove tags and their content for script/style tags
    parser: {
      decodeEntities: true, // Decode entities for proper processing
    },
  });

  // sanitize-html already handles entity encoding properly,
  // so no additional encoding step is needed
  return sanitized;
}

module.exports = { sanitizeRequest };
