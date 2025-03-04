// CODI QR Request Controller
// **************************

// Imports
// *******
const axios = require("axios");
require("dotenv").config({ path: "../config/.env" });
const { getCodiQrUrl } = require("./utils/getCodiQrUrl");
const { getSellerApiKey } = require("./utils/getSellerApiKey");
const { generateSignature } = require("./utils/generateDigitalSignature");

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
      const crtLogIn = process.env.CRT_LOG_IN;
      const crtOper = process.env.CRT_OPER;
      // console.log("\n🔵 Developer crtLogIn: ", crtLogIn);
      // console.log("\n🔵 Developer crtOper: ", crtLogIn);

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
