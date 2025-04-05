const { body } = require("express-validator");
const validAsciiCharacters = require("../config/validAsciiCharacters");

const qrValidationRules = [
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
      // 0 is allowed: User will define the amount.
      return hasTwoDecimals && numValue >= 0 && numValue <= 999999999999.99;
    })
    .withMessage(
      "Monto must be a number between 0 and 999,999,999,999.99 with at most two decimal places"
    ),

  body("referenciaNumerica")
    .customSanitizer((value) => {
      // If the value is an empty string, convert it to "0"
      return value === "" ? "0" : value;
    })
    .custom((value) => {
      // Convert value to a string for validation
      const stringValue = value.toString();
      // Check if it is alphanumeric and matches the length constraint
      const isValid = /^[a-zA-Z0-9]{1,7}$/.test(stringValue);
      return isValid;
    })
    .withMessage(
      "ReferenciaNumerica must be a string or number with a maximum length of 7 characters and no special characters"
    ),

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

  body("vigencia")
    // ToDo: Must be larger than [ventana_vigencia]
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
      // If timestamp has 10 digits or less, assume it's in seconds and convert to ms
      const normalizedTimestamp =
        timestamp < 10000000000 ? timestamp * 1000 : timestamp;
      // Check if timestamp is in the past
      if (normalizedTimestamp < currentTime) {
        throw new Error("Vigencia timestamp must be in the future");
      }
      // Check if timestamp is more than 1 year in the future
      if (normalizedTimestamp > currentTime + oneYearInMs) {
        throw new Error("Vigencia timestamp cannot exceed one year from now");
      }
      return true;
    }),
];

module.exports = {
  qrValidationRules,
};
