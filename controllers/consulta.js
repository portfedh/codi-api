/**
 * @fileoverview Controller for querying the status of CODI payment messages from Banxico
 * @module controllers/consulta
 */

// CODI Consulta del Estado de un Mensaje de Cobro
// ***********************************************

// Imports
// *******
const axios = require("axios");
const moment = require("moment-timezone");
require("dotenv").config({ path: "../config/.env" });
const { verifySignature } = require("./utils/verifySignature");
const { getCodiConsultaUrls } = require("./utils/getCodiConsultaUrls");
const { getKeyCredentials } = require("./utils/getKeyCredentials");
const { compareCrtBanxico } = require("./utils/compareCrtBanxico");
const { generateSignature } = require("./utils/generateDigitalSignature");
const { getBanxicoCredentials } = require("./utils/getBanxicoCredentials");
const { verifyBanxicoResponse } = require("./utils/verifyBanxicoResponse");
const { insertRequestResponse } = require("./utils/insertRequestResponse");
const { getDeveloperCredentials } = require("./utils/getDeveloperCredentials");
const { makeRequestWithFallback } = require("./utils/makeRequestWithFallback");

// Exports
// *******
module.exports = {
  /**
   * @function getBillingInfo
   * @async
   * @description Queries the status of a CODI payment message from Banxico's API
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing query parameters
   * @param {string} req.body.folioCodi - CODI reference number to query
   * @param {number} req.body.tpg - Number of operations per page
   * @param {number} req.body.npg - Page number to retrieve
   * @param {string} req.body.fechaInicial - Start date for the query period
   * @param {string} req.body.fechaFinal - End date for the query period
   * @param {Object} res - Express response object
   *
   * @returns {Object} Response with success status and queried data
   * @returns {boolean} response.success - Indicates if the operation was successful
   * @returns {Object} [response.data] - Payment status data from Banxico (on success)
   * @returns {string} [response.error] - Error message (on failure)
   *
   * @throws Will return a 400 response if signature verification fails
   * @throws Will return a 400 response if Banxico returns an error code
   * @throws Will return a 400 response if Banxico certificate doesn't match
   * @throws Will return a 500 response for any other errors
   */
  getBillingInfo: async (req, res) => {
    //  Capture request timestamp in Mexico City time
    const requestTimestamp = moment().tz("America/Mexico_City");
    // console.log("Req Timestamp", requestTimestamp)

    try {
      // Get payment data
      const { folioCodi, tpg, npg, fechaInicial, fechaFinal } = req.body;
      // console.log("\n🔵 Datos de pago: ", req.body);

      // Get url endpoints
      const { primary: primaryUrl, secondary: secondaryUrl } =
        getCodiConsultaUrls();
      // console.log("\n🔵 Consulta Endpoints: ", { primaryUrl, secondaryUrl });

      // Get seller api key
      const apiKey = req.apiKey;
      // console.log("\n🔵 Seller API Key: ", apiKey);

      // Get developer credentials
      const { crtLogIn: crtLogin, crtOper } = getDeveloperCredentials();
      // crtLogin es diferente en la consulta que en el cobro
      // console.log("\n🔵 Developer crtLogIn: ", crtLogin);
      // console.log("\n🔵 Developer crtOper: ", crtOper);

      // Get Developer Public Key Certificate
      const { publicKey } = getKeyCredentials();
      // console.log("\n🔵 Developer Public Key Certificate: ", publicKey);

      // Get Banxico Public Key Certificate
      const { crtBanxico, publicKeyBanxico } = getBanxicoCredentials();
      // console.log("\n🔵 Banxico Public Key Certificate: ", publicKeyBanxico);

      // Get epoch
      const epoch = Date.now();
      // console.log("\n🔵 Epoch: ", epoch);

      // Create object
      const peticionConsulta = {
        apiKey,
        folioCodi,
        tpg, // 5 operaciones por pagina
        npg, // pagina 1: 1-5, pagina 2: 6-10
        fechaInicial,
        fechaFinal,
      };
      // console.log("\n🔵 Datos a firmar: ", peticionConsulta);

      // Sign the data
      const selloDigital = await generateSignature(peticionConsulta, epoch);
      // console.log("\n🔵 Sello digital: ", selloDigital);

      // Create request object
      const requestObject = {
        peticionConsulta,
        selloDigital,
        epoch,
        crtLogin,
        crtOper,
      };
      // console.log("\n🔵 Request object: ", requestObject);

      const requestBody = `d=${JSON.stringify(requestObject)}`;
      // console.log("\n🔵 Request body a Banxico: ", requestBody);

      // Verify the signature
      const isVerified = verifySignature(requestObject, publicKey);
      // console.log("\n🔵 Firma de desarrollador verificada: ", isVerified);

      if (!isVerified) {
        return res.status(400).json({
          success: false,
          error: "Signature verification failed on request data",
        });
      }

      // Send the data to Banxico with fallback
      const response = await makeRequestWithFallback(
        primaryUrl,
        secondaryUrl,
        requestBody,
        { timeout: 3000 }
      );
      // console.log("\n🔵 Respuesta de Banxico: ", response.data);

      //  Capture response timestamp in Mexico City time
      const responseTimestamp = moment().tz("America/Mexico_City");
      // console.log("response timestamp", responseTimestamp)

      // Verify Banxico response code
      const banxicoResult = verifyBanxicoResponse(response);
      if (!banxicoResult.success) {
        return res.status(400).json(banxicoResult);
      }

      // Verify that crtBdeM value matches our records
      const crtBanxicoVerified = compareCrtBanxico(crtBanxico, response.data);
      // console.log("\n🔵 Certificado de Banxico verificado: ", crtBanxicoVerified);
      if (!crtBanxicoVerified) {
        return res.status(400).json({
          success: false,
          error: "Banxico public key certificate mismatch",
        });
      }

      // Verify Banxico signed data
      const responseIsVerified = verifySignature(
        response.data,
        publicKeyBanxico
      );
      // console.log("\n🔵  Mensaje de Banxico verificado: ", responseIsVerified);
      if (!responseIsVerified) {
        return res.status(400).json({
          success: false,
          error: "Signature verification failed on response data",
        });
      }

      // Send response immediately
      res.status(200).json({
        success: true,
        data: response.data,
      });

      // Log the request and response asynchronously
      try {
        await insertRequestResponse({
          route: "/v2/codi/consulta",
          requestHeaders: req.headers,
          requestPayload: req.body,
          requestTimestamp: requestTimestamp,
          responsePayload: response.data,
          responseStatus: 200,
          responseTimestamp: responseTimestamp,
        });
      } catch (logError) {
        console.error("Error logging request/response:", logError);
      }
    } catch (error) {
      console.error(
        "Error en consulta del Estado de un Mensaje de Cobro: ",
        error
      );

      // Send error response immediately
      res.status(500).json({
        success: false,
        error: "Error processing QR request",
      });

      // Log the error asynchronously
      try {
        await insertRequestResponse({
          route: "/v2/codi/consulta",
          requestHeaders: req.headers,
          requestPayload: req.body,
          requestTimestamp: requestTimestamp,
          responsePayload: { error: error.message },
          responseStatus: 500,
          responseTimestamp: moment().tz("America/Mexico_City"),
        });
      } catch (logError) {
        console.error("Error logging error response:", logError);
      }
    }
  },
};
