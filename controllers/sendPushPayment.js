// CODI Push Request Controller
// **************************

// Imports
// *******
const axios = require("axios");
const moment = require("moment-timezone");
require("dotenv").config({ path: "../config/.env" });
const { getCodiPushUrls } = require("./utils/getCodiPushUrl");
const { verifySignature } = require("./utils/verifySignature");
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
   * Sends a CODI push payment request to Banxico's API
   *
   * This controller handles the full payment request flow:
   * 1. Retrieves payment data from request body
   * 2. Gets necessary endpoints and credentials
   * 3. Creates and digitally signs the payment request
   * 4. Verifies the signature before sending
   * 5. Sends request to Banxico
   * 6. Verifies Banxico's response signature and certificates
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing payment details
   * @param {string} req.body.celularCliente - Customer's 10-digit phone number
   * @param {number} req.body.monto - Payment amount
   * @param {string} req.body.referenciaNumerica - Numeric reference for the payment
   * @param {string} req.body.concepto - Payment concept/description
   * @param {string} req.body.vigencia - Payment validity period
   * @param {Object} res - Express response object
   *
   * @returns {Object} JSON response with status and data
   * @returns {boolean} response.success - Whether the operation was successful
   * @returns {Object} [response.data] - Data returned from Banxico on success
   * @returns {string} [response.error] - Error message if operation failed
   */
  sendPushPayment: async (req, res) => {
    //  Capture request timestamp in Mexico City time
    const requestTimestamp = moment().tz("America/Mexico_City");
    // console.log("Req Timestamp", requestTimestamp)

    try {
      // Get payment data
      const { celularCliente, monto, referenciaNumerica, concepto, vigencia } =
        req.body;
      // console.log("\n🔵 Datos de pago: ", req.body);

      // Get url endpoints
      const { primary: primaryUrl, secondary: secondaryUrl } =
        getCodiPushUrls();
      // console.log("\n🔵 Push Endpoints: ", { primaryUrl, secondaryUrl });

      // Get seller api key
      const apiKey = req.apiKey;
      // console.log("\n🔵 Seller API Key: ", apiKey);

      // Get developer credentials
      const { crtLogIn, crtOper } = getDeveloperCredentials();
      // console.log("\n🔵 Developer crtLogIn: ", crtLogIn);
      // console.log("\n🔵 Developer crtOper: ", crtLogIn);

      // Get Developer Public Key Certificate
      const { publicKey } = getKeyCredentials();
      // console.log("\n🔵 Public Key Certificate: ", publicKey);

      // Get Banxico Public Key Certificate
      const { crtBanxico, publicKeyBanxico } = getBanxicoCredentials();
      // console.log("\n🔵 Banxico Public Key Certificate: ", publicKeyBanxico);

      // Get epoch
      const epoch = Date.now();
      // console.log("\n🔵 Epoch: ", epoch);

      // Create object
      const datosMC = {
        celularCliente, // 10 digits
        monto,
        referenciaNumerica,
        concepto,
        vigencia,
        apiKey,
      };
      // console.log("\n🔵 Datos a firmar: ", datosMC);

      // Sign the data
      const selloDigital = await generateSignature(datosMC, epoch);
      // console.log("\n🔵 Sello digital: ", selloDigital);

      // Create request body
      const requestBody = {
        datosMC,
        selloDigital,
        epoch,
        crtLogIn,
        crtOper,
      };
      // console.log("\n🔵 Request body a Banxico: ", requestBody);

      const isVerified = verifySignature(requestBody, publicKey);
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
          route: "/v2/codi/push",
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
      console.error("Error in sendPushPayment:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        response: error.response?.data,
      });

      // Send error response immediately
      res.status(500).json({
        success: false,
        error: "Error processing Push request",
      });

      // Log the error asynchronously
      try {
        await insertRequestResponse({
          route: "/v2/codi/push",
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
