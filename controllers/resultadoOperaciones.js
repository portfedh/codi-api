/**
 * ResultadoOperaciones Controller
 *
 * This controller processes and validates operation results from Banxico's CoDi payment system.
 * It verifies signatures, validates request parameters, and ensures data integrity before
 * providing a response with the appropriate status code.
 *
 * @module controllers/resultadoOperaciones
 */

// Imports
// *******
const moment = require("moment-timezone");
const { verifyDigit } = require("./utils/verifyDigit");
const { verifyCellPhone } = require("./utils/verifyCellPhone");
const { verifySignature } = require("./utils/verifySignature");
const { verifyCrtBanxico } = require("./utils/verifyCrtBanxico");
const { verifyTimeStamps } = require("./utils/verifyTimeStamps");
const { verifyClientName } = require("./utils/verifyClientName");
const { verifyParameters } = require("./utils/verifyParameters");
const { fwdToCustomerUrl } = require("./utils/fwdToCustomerUrl");
const { verifyAccountType } = require("./utils/verifyAccountType");
const { verifyMensajeCobro } = require("./utils/verifyMensajeCobro");
const { verifyCrtDeveloper } = require("./utils/verifyCrtDeveloper");
const { verifyIdMensajeCobro } = require("./utils/verifyIdMensajeCobro");
const { verifyInstitutionCode } = require("./utils/verifyInstitutionCode");
const { getBanxicoCredentials } = require("./utils/getBanxicoCredentials");
const { insertRequestResponse } = require("./utils/insertRequestResponse");
const {
  verifyResultadoMensajeDeCobro,
} = require("./utils/verifyResultadoMensajeCobro");
const supabase = require("../config/supabase"); // Import supabase client

module.exports = {
  /**
   * Handles and validates operation results from payment requests
   *
   * This controller function processes operation results by:
   * 1. Verifying the digital signature using Banxico's public key
   * 2. Running a series of validation checks on the request data
   * 3. Returning appropriate status codes based on validation results
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing operation result data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with resultado status code
   *                   0 if successful, negative values for specific errors
   */
  resultadoOperaciones: async (req, res) => {
    // console.log("Request body: ", req.body);

    //  Capture request timestamp in UTC
    const requestTimestamp = moment.utc();
    let responsePayload = { resultado: 0 }; // Default success response

    try {
      const resultado = req.body;

      const checks = [
        verifyParameters, // Check All fields and sub-fields present
        verifyCellPhone, // Check celularCliente is a 10-digit number in a string
        verifyDigit, // Check digitoVerificadorCliente is a number of 1-9 digits
        verifyClientName, //Check client name is an alphanumeric character up to 40 characters long
        verifyInstitutionCode, // Check its a 3-digit number in a string and in the list of valid institutions
        verifyAccountType, // Check tipoCuentaCliente is a valid number
        verifyCrtDeveloper, // Compare certComercioProveedor with crtOper (Developer) in env file
        verifyCrtBanxico, // Compare certBdeM with crtBanxico in env file
        verifyResultadoMensajeDeCobro, // Check resultadoMensajeCobro is a valid response number
        verifyIdMensajeCobro, // Check idMensajeCobro is a string of 10 or 20 characters
        verifyMensajeCobro, // Check concepto is a string of at least 1 character
        verifyTimeStamps, // Check all timestamps are valid and in order
      ];

      for (let i = 0; i < checks.length; i++) {
        const checkResult = checks[i](resultado);
        if (checkResult !== 0) {
          console.log(
            `Check ${checks[i].name} failed with result ${checkResult}`
          );
          responsePayload = { resultado: checkResult };
          break;
        }
      }

      if (responsePayload.resultado === 0) {
        // Perform signature verification as the last step
        const { publicKeyBanxico } = getBanxicoCredentials();
        const isVerified = verifySignature(resultado, publicKeyBanxico);

        if (!isVerified) {
          console.log("Signature verification failed. Resultado -8");
          responsePayload = { resultado: -8 };
        } else {
          console.log("All checks passed. Processing request.... Resultado 0");
        }
      }

      //  Capture response timestamp in UTC
      const responseTimestamp = moment.utc();

      // Send response immediately
      res.status(200).json(responsePayload);

      // Log the request and response asynchronously
      try {
        await insertRequestResponse({
          route: "/v2/resultadoOperaciones",
          requestHeaders: req.headers,
          requestPayload: req.body,
          requestTimestamp: requestTimestamp,
          responsePayload: responsePayload,
          responseStatus: 200,
          responseTimestamp: responseTimestamp,
        });
      } catch (logError) {
        console.error("Error logging request/response:", logError);
      }

      // Forward to customer callback_url
      try {
        await fwdToCustomerUrl(resultado, responsePayload.resultado);
      } catch (callbackError) {
        console.error("Error forwarding callback:", callbackError);
      }
    } catch (error) {
      console.error("Error in resultadoOperaciones:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        response: error.response?.data,
      });

      const errorResponse = {
        resultado: -1,
        error: "Error processing operation results",
        details: error.message,
      };

      // Send error response immediately
      res.status(500).json(errorResponse);

      // Log the error asynchronously
      try {
        await insertRequestResponse({
          route: "/v2/resultadoOperaciones",
          requestHeaders: req.headers,
          requestPayload: req.body,
          requestTimestamp: requestTimestamp,
          responsePayload: errorResponse,
          responseStatus: 500,
          responseTimestamp: moment.utc(),
        });
      } catch (logError) {
        console.error("Error logging error response:", logError);
      }
    }
  },
};
