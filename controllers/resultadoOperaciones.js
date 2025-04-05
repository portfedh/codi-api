/**
 * ResultadoOperaciones Controller
 *
 * This controller processes and validates operation results from Banxico's CODI payment system.
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
const { verifyParameters } = require("./utils/verifyParameters");
const { verifyMensajeCobro } = require("./utils/verifyMensajeCobro");
const { verifyCrtDeveloper } = require("./utils/verifyCrtDeveloper");
const { verifyIdMensajeCobro } = require("./utils/verifyIdMensajeCobro");
const { getBanxicoCredentials } = require("./utils/getBanxicoCredentials");
const { insertRequestResponse } = require('./utils/insertRequestResponse');
const {
  verifyResultadoMensajeDeCobro,
} = require("./utils/verifyResultadoMensajeCobro");

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
    //  Capture request timestamp in Mexico City time
    const requestTimestamp = moment().tz('America/Mexico_City');

    try {
      const resultado = req.body;

      // Get Banxico Public Key Certificate
      const { publicKeyBanxico } = getBanxicoCredentials();

      const isVerified = verifySignature(resultado, publicKeyBanxico);
      if (!isVerified) {
        console.log("Signature verification failed. Resultado -8");
        
        //  Capture response timestamp in Mexico City time
        const responseTimestamp = moment().tz('America/Mexico_City');
        // console.log("Response timestamp", responseTimestamp)
        
        //  Log the request and response
        await insertRequestResponse(
          '/resultadoOperaciones',
          req.headers,
          req.body,
          requestTimestamp,
          { resultado: -8 }, //  Response payload
          200,
          responseTimestamp
        );

        return res.status(200).json({
          resultado: -8,
        });
      }

      const checks = [
        verifyParameters, // Check All fields and sub-fields present
        verifyDigit, // Check digitoVerificadorCliente is a number of 1-9 digits
        verifyCellPhone, // Check celularCliente is a 10-digit number in a string
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

          //  Capture response timestamp in Mexico City time
          const responseTimestamp = moment().tz('America/Mexico_City');
          
          //  Log the request and response
          await insertRequestResponse(
            '/resultadoOperaciones',
            req.headers,
            req.body,
            requestTimestamp,
            { resultado: checkResult, temp_request_body: req.body }, //  Response payload
            200,
            responseTimestamp
          );

          return res.status(200).json({
            resultado: checkResult,
            temp_request_body: req.body,
          });
        }
      }

      // If all checks pass
      console.log("All checks passed. Processing request.... Resultado 0");

      //  Capture response timestamp in Mexico City time
      const responseTimestamp = moment().tz('America/Mexico_City');
      
      //  Log the request and response
      await insertRequestResponse(
        '/resultadoOperaciones',
        req.headers,
        req.body,
        requestTimestamp,
        { resultado: 0 }, //  Response payload
        200,
        responseTimestamp
      );

      return res.status(200).json({
        resultado: 0,
      });
    } catch (error) {
      console.error("Error processing resultadoOperaciones: ", error);

      const responseTimestamp = moment().tz('America/Mexico_City');
      
      //  Log the request and error response
      await insertRequestResponse(
        '/resultadoOperaciones',
        req.headers,
        req.body,
        requestTimestamp,
        { error: error.message },
        500,
        responseTimestamp
      );

      return res.status(500).json({
        resultado: -1,
        error: "Error processing operation results"
      });
    }
  },
};
