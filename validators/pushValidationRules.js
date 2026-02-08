/**
 * @module validators/pushValidationRules
 * @description Validation rules for push payment requests
 *
 * This module contains validation rules for push payment requests using express-validator.
 * It validates the following fields:
 * - celularCliente: Client's phone number
 * - monto: Payment amount (must be numeric, between 0 and 999,999,999,999.99, with at most 2 decimal places)
 * - referenciaNumerica: Numeric reference (optional, alphanumeric, max length 7, no special characters)
 * - concepto: Payment concept (string, 1-40 characters, only allowed ASCII characters)
 * - vigencia: Payment validity period (must be "0" or a numeric timestamp in the future, not exceeding one year from now)
 */

const { body } = require("express-validator");
const validAsciiCharacters = require("../config/validAsciiCharacters");

/**
 * @constant {Array} pushValidationRules
 * @description Array of validation rules for push payment requests
 *
 * @example
 * // Valid request body example:
 * {
 *   celularCliente: "5512345678",
 *   monto: 95.63,
 *   referenciaNumerica: "1234567",
 *   concepto: "Payment for services",
 *   vigencia: "0"
 * }
 */
const pushValidationRules = [
  /**
   * @name celularCliente
   * @description Validates the client's phone number
   * @type {string|number}
   * @rules
   * - Must not be empty
   * - Must contain exactly 10 numeric digits
   * - Can be provided as string or number
   * @example "5512345678" or 5512345678
   */
  body("celularCliente")
    .notEmpty()
    .withMessage("celularCliente cannot be empty")
    .custom((value) => {
      // Convert value to string (in case it's a number)
      const stringValue = String(value);
      // Check if it contains exactly 10 numeric digits and nothing else
      return /^\d{10}$/.test(stringValue);
    })
    .withMessage("CelularCliente must contain exactly 10 numeric digits"),

  /**
   * @name monto
   * @description Validates the payment amount
   * @type {number|string}
   * @rules
   * - Must not be empty
   * - Must be a numeric value
   * - Must have at most 2 decimal places
   * - Must be between 0 and 999,999,999,999.99
   * @example 95.63 or "95.63"
   */
  body("monto")
    .notEmpty()
    .withMessage("Monto cannot be empty")
    .isNumeric()
    .withMessage("Monto must be a numeric value")
    .custom((value) => {
      // Convert value to a number
      const numValue = parseFloat(value);
      // Check if it has at most two decimal places
      const hasTwoDecimals = /^\d+(\.\d{1,2})?$/.test(value);
      // Ensure it is within the valid range
      // 0 is not allowed
      return hasTwoDecimals && numValue >= 0 && numValue <= 999999999999.99;
    })
    .withMessage(
      "Monto must be a number between 0 and 999,999,999,999.99 with at most two decimal places"
    ),

  /**
   * @name referenciaNumerica
   * @description Validates the numeric reference
   * @type {string|number}
   * @rules
   * - Can be empty (will be converted to "0")
   * - Must contain only digits (0-9)
   * - Maximum length of 7 digits
   * @example "1234567" or 1234567
   */
  body("referenciaNumerica")
    .customSanitizer((value) => {
      // If the value is an empty string, convert it to "0"
      return value === "" ? "0" : value;
    })
    .custom((value) => {
      // Convert value to a string for validation
      const stringValue = value.toString();
      // Check if it contains only digits and matches the length constraint
      const isValid = /^[0-9]{1,7}$/.test(stringValue);
      return isValid;
    })
    .withMessage(
      "ReferenciaNumerica must contain only digits (0-9) with a maximum length of 7"
    ),

  /**
   * @name concepto
   * @description Validates the payment concept
   * @type {string}
   * @rules
   * - Must be a string
   * - Length between 1 and 40 characters
   * - Only allowed ASCII characters (defined in validAsciiCharacters config)
   * @example "Payment for services"
   */
  body("concepto")
    .isString()
    .isLength({ min: 1, max: 40 })
    .withMessage(
      "Concepto must be a string with a minimum length of 1 and maximum length of 40 allowed ascii characters"
    )
    .custom((value) => {
      // Create a set of valid characters for faster lookup
      const validChars = new Set(Object.values(validAsciiCharacters));

      // Check if all characters in the string are valid
      for (const char of value) {
        if (!validChars.has(char)) {
          return false;
        }
      }
      return true;
    })
    .withMessage("Concepto contains invalid characters"),

  /**
   * @name vigencia
   * @description Validates the payment validity period
   * @type {string|number}
   * @rules
   * - Must not be empty
   * - Special case: "0" is valid (no expiration)
   * - Must be numeric if not "0"
   * - Maximum length of 15 digits
   * - Must be a valid millisecond timestamp (Banxico spec)
   * - Must be in the future
   * - Cannot exceed one year from now
   * @example "0" or "1672531200000" (milliseconds)
   */
  body("vigencia")
    .notEmpty()
    .withMessage("Vigencia cannot be empty")
    .custom((value) => {
      // Convert value to a string for validation
      const stringValue = String(value); // Force convert to string
      // Special case: If value is "0", it's valid
      if (stringValue === "0") {
        return true;
      }
      // Check if it's a numeric string (no letters or special chars)
      if (!/^\d+$/.test(stringValue)) {
        throw new Error(
          "Vigencia must be '0' or a numeric value without any letters or special characters"
        );
      }
      // Check length
      if (stringValue.length > 15) {
        throw new Error("Vigencia numeric value cannot exceed 15 digits");
      }
      // Convert to number and check if it's a valid timestamp
      const timestamp = Number(stringValue);
      if (isNaN(timestamp)) {
        throw new Error("Vigencia must be a valid numeric timestamp");
      }
      // Current time in milliseconds
      const currentTime = Date.now();
      const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
      // Banxico expects milliseconds — reject values that look like seconds
      if (timestamp > 0 && timestamp < 10000000000) {
        throw new Error(
          "Vigencia must be a millisecond timestamp (not seconds). Multiply by 1000 if needed"
        );
      }
      // Check if timestamp is in the past
      if (timestamp < currentTime) {
        throw new Error("Vigencia timestamp must be in the future");
      }
      // Check if timestamp is more than 1 year in the future
      if (timestamp > currentTime + oneYearInMs) {
        throw new Error("Vigencia timestamp cannot exceed one year from now");
      }
      return true;
    }),
];

module.exports = {
  pushValidationRules,
};
