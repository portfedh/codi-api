const { body } = require("express-validator");
const validAsciiCharacters = require("../config/validAsciiCharacters");

const qrValidationRules = [
  body("monto")
    .isNumeric()
    .withMessage("Monto must be a numeric value")
    .custom((value) => {
      // Convert value to a number
      const numValue = parseFloat(value);
      // Check if it has at most two decimal places
      const hasTwoDecimals = /^\d+(\.\d{1,2})?$/.test(value);
      // Ensure it is within the valid range
      return hasTwoDecimals && numValue >= 0 && numValue <= 999999999999.99;
    })
    .withMessage(
      "Monto must be a number between 0 and 999,999,999,999.99 with at most two decimal places"
    ),

  body("referenciaNumerica")
    .custom((value) => {
      // Convert value to a string for validation
      const stringValue = value.toString();
      // Check if it is alphanumeric and matches the length constraint
      const isValid = /^[a-zA-Z0-9]{1,7}$/.test(stringValue);
      return isValid;
    })
    .withMessage(
      "ReferenciaNumerica must be an alphanumeric string or number with a maximum length of 7 characters and no special characters"
    ),

  body("concepto")
    .isString()
    .isLength({ max: 40 })
    .withMessage(
      "Concepto must be a string with a maximum length of 40 characters"
    )
    .custom((value) => {
      // Check if all characters in the string are valid ASCII characters
      for (const char of value) {
        const asciiCode = char.charCodeAt(0);
        if (!validAsciiCharacters[asciiCode]) {
          return false;
        }
      }
      return true;
    })
    .withMessage("Concepto contains invalid characters"),

  body("vigencia")
    .custom((value) => {
      // Convert value to a string for validation
      const stringValue = value.toString();
      // Check if it is either "0" or a valid Date.now() value (up to 15 characters long)
      const isValid = stringValue === "0" || /^\d{1,15}$/.test(stringValue);
      return isValid;
    })
    .withMessage(
      "Vigencia must be a number or string, max 15 characters long, that can be a Date.now() value or 0"
    ),
];

module.exports = {
  qrValidationRules,
};
