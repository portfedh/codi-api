// CODI Push Request Controller
// **************************

// Imports
// *******
const axios = require("axios");
require("dotenv").config({ path: "../config/.env" });
const { getCodiPushUrl } = require("./utils/getCodiPushUrl");
const { getSellerApiKey } = require("./utils/getSellerApiKey");
const { verifySignature } = require("./utils/verifySignature");
const { getKeyCredentials } = require("./utils/getKeyCredentials");
const { compareCrtBanxico } = require("./utils/compareCrtBanxico");
const { generateSignature } = require("./utils/generateDigitalSignature");
const { getBanxicoCredentials } = require("./utils/getBanxicoCredentials");
const { getDeveloperCredentials } = require("./utils/getDeveloperCredentials");

// Exports
// *******
module.exports = {
  sendPushPayment: async (req, res) => {
    try {
      // Get payment data
      const { celularCliente, monto, referenciaNumerica, concepto, vigencia } =
        req.body;
      // console.log("\n🔵 Datos de pago: ", req.body);

      // Get url endpoint
      const codiApiPushEndpoint = getCodiPushUrl();
      // console.log("\n🔵 Push Endpoint: ", codiApiPushEndpoint);

      // Get seller api key
      const apiKey = getSellerApiKey();
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

      // Send the data to Banxico
      const response = await axios.post(codiApiPushEndpoint, requestBody, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      // console.log("\n🔵 Respuesta de Banxico: ", response.data);

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

      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      console.error("Error enviando Push request: ", error);
      return res.status(500).json({
        success: false,
        error: "Error processing Push request",
      });
    }
  },
};

// Code to test the controller
// **************************
// return res.status(200).json({
//   success: true,
//   data: requestBody,
// });
