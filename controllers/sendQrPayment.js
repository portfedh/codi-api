// CODI QR Request Controller
// **************************

// Imports
// *******
const axios = require("axios");
require("dotenv").config({ path: "../config/.env" });
const { getCodiQrUrl } = require("./utils/getCodiQrUrl");
const { getSellerApiKey } = require("./utils/getSellerApiKey");
const { verifySignature } = require("./utils/verifySignature");
const { getKeyCredentials } = require("./utils/getKeyCredentials");
const { generateSignature } = require("./utils/generateDigitalSignature");
const { getDeveloperCredentials } = require("./utils/getDeveloperCredentials");

// Exports
// *******
module.exports = {
  sendQrPayment: async (req, res) => {
    try {
      // Get payment data
      const { monto, referenciaNumerica, concepto, vigencia } = req.body;
      // console.log("\n🔵 Datos de pago: ", req.body);

      // Get url endpoint
      const codiApiQrEndpoint = getCodiQrUrl();
      // console.log("\n🔵 QR Endpoint: ", codiApiQrEndpoint);

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
      // const banxicoPublicKey = process.env.BANXICO_PUBLIC_KEY;

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

      // Verify the signature
      const isVerified = verifySignature(requestBody, publicKey);
      // console.log("\n🔵 Firma verificada: ", isVerified);

      if (!isVerified) {
        return res.status(400).json({
          success: false,
          error: "Signature verification failed",
        });
      }

      // return res.status(200).json({
      //   success: true,
      //   data: requestBody,
      // });

      // Send the data
      const response = await axios.post(codiApiQrEndpoint, requestBody, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      // Parse Response
      // console.log("\n🔵 Respuesta de Banxico: ", response.data);
      // const data = JSON.parse(response.data);
      // console.log("\n🔵 Respuesta JSON de Banxico: ", data);

      // Verify the signed data
      // Get cadenaMC from response
      // Save IDC Value inside cadenaMC in database
      // Create a QR code with cadenaMC value
      // Send the QR code to the client

      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      console.error("Error enviando Código QR: ", error);
      return res.status(500).json({
        success: false,
        error: "Error processing QR request",
      });
    }
  },
};
