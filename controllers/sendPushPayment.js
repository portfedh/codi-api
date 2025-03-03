// CODI Push Request Controller
// **************************

// Imports
// *******
const axios = require("axios");
require("dotenv").config({ path: "../config/.env" });
const { getCodiPushUrl } = require("./utils/getCodiPushUrl");
const { getSellerApiKey } = require("./utils/getSellerApiKey");
const { generateSignature } = require("./utils/generateDigitalSignature");

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
      const crtLogIn = process.env.CRT_LOG_IN;
      const crtOper = process.env.CRT_OPER;
      // console.log("\n🔵 Developer crtLogIn: ", crtLogIn);
      // console.log("\n🔵 Developer crtOper: ", crtLogIn);

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
      const selloDigital = await generateSignature(datosMC);
      // console.log("\n🔵 Sello digital: ", selloDigital);

      // Create request body
      const epoch = Date.now();
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
      const response = await axios.post(codiApiPushEndpoint, requestBody, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

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
