/**
 * @module validators/consultaValidationRules
 * @description Validation rules for payment consultation requests
 *
 * This module contains validation rules for payment consultation requests using express-validator.
 * It validates the following fields:
 * - folioCodi: CODI payment reference number
 * - tpg: Payment type group
 * - npg: Payment number group
 * - fechaInicial: Initial date for consultation
 * - fechaFinal: Final date for consultation (can be "0" or a valid date not in the future)
 */

const { body } = require("express-validator");

/**
 * @constant {Array} consultaValidationRules
 * @description Array of validation rules for payment consultation requests
 *
 * @example
 * // Valid request body example:
 * {
 *   folioCodi: "1234567890",
 *   tpg: 1,
 *   npg: 1,
 *   fechaInicial: "20230101",
 *   fechaFinal: "20230131"
 * }
 */
const consultaValidationRules = [
  /**
   * @name folioCodi
   * @description Validates the CODI payment reference number
   * @type {string}
   * @rules
   * - Must be a string
   * - Must not be empty
   * - Must be exactly 10 or 20 characters long
   * @example "1234567890" or "12345678901234567890"
   */
  body("folioCodi")
    .isString()
    .notEmpty()
    .withMessage("FolioCodi is required")
    .custom((value) => {
      return value.length === 10 || value.length === 20;
    })
    .withMessage("FolioCodi must be 10 or 20 characters long"),

  /**
   * @name tpg
   * @description Validates the payment type group
   * @type {number|string}
   * @rules
   * - Must not be empty
   * - Must be a number between 1 and 100
   * @example 1 or "1"
   */
  body("tpg")
    .notEmpty()
    .withMessage("tpg is required")
    .custom((value) => {
      const numValue = parseInt(value, 10);
      return !isNaN(numValue) && numValue >= 1 && numValue <= 100;
    })
    .withMessage("tpg must be a number between 1 and 100"),

  /**
   * @name npg
   * @description Validates the payment number group
   * @type {number|string}
   * @rules
   * - Must not be empty
   * - Must be a number between 1 and 2147483647
   * @example 1 or "1"
   */
  body("npg")
    .notEmpty()
    .withMessage("npg is required")
    .custom((value) => {
      const numValue = parseInt(value, 10);
      return !isNaN(numValue) && numValue >= 1 && numValue <= 2147483647;
    })
    .withMessage("npg must be a number between 1 and 2147483647"),

  /**
   * @name fechaInicial
   * @description Validates the initial date for consultation
   * @type {string}
   * @rules
   * - Must not be empty
   * - Must be exactly 8 characters in YYYYMMDD format
   * - Must contain only digits
   * - Must be a valid date
   * @example "20230101" (January 1, 2023)
   */
  body("fechaInicial")
    .notEmpty()
    .withMessage("fechaInicial is required")
    .isLength({ min: 8, max: 8 })
    .withMessage("fechaInicial must be 8 characters in YYYYMMDD format")
    .matches(/^\d{8}$/)
    .withMessage("fechaInicial must contain only digits in YYYYMMDD format")
    .custom((value) => {
      // Check if valid date in YYYYMMDD format
      const year = parseInt(value.substring(0, 4), 10);
      const month = parseInt(value.substring(4, 6), 10) - 1; // JS months are 0-based
      const day = parseInt(value.substring(6, 8), 10);
      const date = new Date(year, month, day);

      // Check if date is valid
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    })
    .withMessage("fechaInicial must be a valid date in YYYYMMDD format"),

  /**
   * @name fechaFinal
   * @description Validates the final date for consultation
   * @type {string}
   * @rules
   * - Must not be empty
   * - Can be "0" (no end date)
   * - If not "0", must be exactly 8 characters in YYYYMMDD format
   * - Must contain only digits
   * - Must be a valid date
   * - Must be after fechaInicial
   * - Must not be in the future
   * @example "20230131" (January 31, 2023) or "0"
   */
  body("fechaFinal")
    .notEmpty()
    .withMessage("fechaFinal is required")
    .custom((value) => {
      // Allow zero value
      if (value === "0") return true;

      // Check length and format
      if (!/^\d{8}$/.test(value)) return false;

      // Check if valid date
      const year = parseInt(value.substring(0, 4), 10);
      const month = parseInt(value.substring(4, 6), 10) - 1;
      const day = parseInt(value.substring(6, 8), 10);
      const date = new Date(year, month, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    })
    .withMessage("fechaFinal must be '0' or a valid date in YYYYMMDD format")
    .custom((value, { req }) => {
      // Skip validation if value is 0
      if (value === "0") return true;

      const fechaInicial = req.body.fechaInicial;
      const currentDate = new Date();

      // Convert fechaInicial to Date
      const initialYear = parseInt(fechaInicial.substring(0, 4), 10);
      const initialMonth = parseInt(fechaInicial.substring(4, 6), 10) - 1;
      const initialDay = parseInt(fechaInicial.substring(6, 8), 10);
      const fechaInicialDate = new Date(initialYear, initialMonth, initialDay);

      // Convert fechaFinal to Date
      const finalYear = parseInt(value.substring(0, 4), 10);
      const finalMonth = parseInt(value.substring(4, 6), 10) - 1;
      const finalDay = parseInt(value.substring(6, 8), 10);
      const fechaFinalDate = new Date(finalYear, finalMonth, finalDay);

      // Check if fechaFinal is after fechaInicial and before current date
      return (
        fechaFinalDate >= fechaInicialDate && fechaFinalDate <= currentDate
      );
    })
    .withMessage("fechaFinal must be after fechaInicial and not in the future"),
];

module.exports = {
  consultaValidationRules,
};
