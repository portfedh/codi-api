// CODI Consulta del Estado de un Mensaje de Cobro
// ***********************************************

// Imports
// *******
const axios = require("axios");
require("dotenv").config({ path: "../config/.env" });
const { getCodiStatusURL } = require("./utils/getCodiStatusUrl");
const { getSellerApiKey } = require("./utils/getSellerApiKey");
const { verifySignature } = require("./utils/verifySignature");
const { generateSignature } = require("./utils/generateDigitalSignature");

// Exports
// *******
module.exports = {
  getBillingInfo: async (req, res) => {
    try {
      // Get payment data
      const { folioCodi, tpg, npg, fechaInicial, fechaFinal } = req.body;
      // console.log("\n🔵 Datos de pago: ", req.body);

      // Get url endpoint
      const codiApiStatusEndpoint = getCodiStatusURL();
      // console.log("\n🔵 QR Endpoint: ", codiApiStatusEndpoint);

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

      // Get Public Key Certificate
      const publicKey = process.env.PUBLIC_KEY;
      // console.log("\n🔵 Public Key Certificate: ", publicKey);

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

      // Create request body
      const requestBody = {
        peticionConsulta,
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
      const response = await axios.post(codiApiStatusEndpoint, requestBody);
      // Revisar que la petición se envíe como UTF-8 y no latin1 o ISO-8859-1

      return res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      console.error(
        "Error en consulta del Estado de un Mensaje de Cobro: ",
        error
      );
      return res.status(500).json({
        success: false,
        error: "Error processing QR request",
      });
    }
  },
};
