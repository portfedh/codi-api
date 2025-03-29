const { body } = require("express-validator");
const validAsciiCharacters = require("../config/validAsciiCharacters");
const moment = require("moment");

const consultaValidationRules = [
  body("folioCodi")
    .isString()
    .notEmpty()
    .withMessage("FolioCodi is required")
    .custom((value) => {
      return value.length === 10 || value.length === 20;
    })
    .withMessage("FolioCodi must be 10 or 20 characters long"),

  body("tpg")
    .notEmpty()
    .withMessage("tpg is required")
    .custom((value) => {
      const numValue = parseInt(value, 10);
      return !isNaN(numValue) && numValue >= 1 && numValue <= 100;
    })
    .withMessage("tpg must be a number between 1 and 100"),

  body("npg")
    .notEmpty()
    .withMessage("npg is required")
    .custom((value) => {
      const numValue = parseInt(value, 10);
      return !isNaN(numValue) && numValue >= 1 && numValue <= 2147483647;
    })
    .withMessage("npg must be a number between 1 and 2147483647"),

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
