// CODI QR Request Controller
// **************************

// Imports
// *******
const axios = require("axios");
const QRCode = require("qrcode");
const moment = require("moment-timezone");
require("dotenv").config({ path: "../config/.env" });
const { getCodiQrUrl } = require("./utils/getCodiQrUrl");
const { verifySignature } = require("./utils/verifySignature");
const { getKeyCredentials } = require("./utils/getKeyCredentials");
const { compareCrtBanxico } = require("./utils/compareCrtBanxico");
const { generateSignature } = require("./utils/generateDigitalSignature");
const { getBanxicoCredentials } = require("./utils/getBanxicoCredentials");
const { verifyBanxicoResponse } = require("./utils/verifyBanxicoResponse");
const { insertRequestResponse } = require('./utils/insertRequestResponse');
const { getDeveloperCredentials } = require("./utils/getDeveloperCredentials");

/**
 * @module sendQrPayment
 * @description Controller for generating and sending CODI QR payment codes by communicating with Banxico API
 */

/**
 * Processes payment data, generates a digitally signed request to Banxico,
 * verifies the response, and returns a QR code to the client.
 *
 * @async
 * @function sendQrPayment
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing payment information
 * @param {string} req.body.monto - Payment amount
 * @param {string} req.body.referenciaNumerica - Numeric reference for the payment
 * @param {string} req.body.concepto - Payment concept/description
 * @param {string} req.body.vigencia - Validity period for the payment
 * @param {Object} res - Express response object
 * @returns {Object} Response containing QR code and Banxico response data
 * @throws {Error} If signature verification fails or communication with Banxico fails
 */
module.exports = {
  sendQrPayment: async (req, res) => {
    // Capture request timestamp in Mexico City time
    const requestTimestamp = moment().tz('America/Mexico_City');

    try {
      // Get payment data
      const { monto, referenciaNumerica, concepto, vigencia } = req.body;
      // console.log("\n🔵 Datos de pago: ", req.body);

      // Get url endpoint
      const codiApiQrEndpoint = getCodiQrUrl();
      // console.log("\n🔵 QR Endpoint: ", codiApiQrEndpoint);

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

      // Verify the signature: Developer
      const isVerified = verifySignature(requestBody, publicKey);
      // console.log("\n🔵 Firma de desarrollador verificada: ", isVerified);

      if (!isVerified) {
        return res.status(400).json({
          success: false,
          error: "Signature verification failed on request data",
        });
      }

      // Send the data to Banxico
      const response = await axios.post(codiApiQrEndpoint, requestBody, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      // console.log("\n🔵 Respuesta de Banxico: ", response.data);

      // Capture response timestamp in Mexico City time
      const responseTimestamp = moment().tz('America/Mexico_City');

      // Log the request and response
      await insertRequestResponse(
        '/v2/codi/qr',
        req.headers,
        requestBody,
        requestTimestamp,
        response.data,
        response.status,
        responseTimestamp
      );

      // Verify Banxico response code
      const banxicoResult = verifyBanxicoResponse(response);
      if (!banxicoResult.success) {
        return res.status(400).json(banxicoResult);
      }

      // Verify th crtBdeM value matches our records
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

      // Create a QR code with cadenaMC value
      // console.log("\n🔵 CadenaMC: ", response.data.cadenaMC);
      const cadenaMCString = JSON.stringify(response.data.cadenaMC)
        .replace(/\\\"/g, '"') // Replace escaped quotes with regular quotes
        .slice(1, -1); // Remove the outer quotes
      // console.log("\n🔵 CadenaMC string: ", cadenaMCString);
      const qrCode = await QRCode.toDataURL(cadenaMCString, {
        errorCorrectionLevel: "H",
      });
      // console.log("\n🔵 QR Code: ", qrCode);

      // Send the QR code to the client
      return res.status(200).json({
        qrCode,
        data: response.data,
      });
    } catch (error) {
      console.error("Error in sendQrPayment:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        response: error.response?.data
      });

      const responseTimestamp = moment().tz('America/Mexico_City');
      
      // Log the request and response with error details
      await insertRequestResponse(
        '/v2/codi/qr',
        req.headers,
        requestBody,
        requestTimestamp,
        { error: error.message },
        500,
        responseTimestamp
      );

      return res.status(500).json({
        success: false,
        error: "Error processing QR request",
      });
    }
  },
};
