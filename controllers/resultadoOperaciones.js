// Imports
// *******
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
const {
  verifyResultadoMensajeDeCobro,
} = require("./utils/verifyResultadoMensajeCobro");

module.exports = {
  resultadoOperaciones: (req, res) => {
    const resultado = req.body;

    // Get Banxico Public Key Certificate
    const { publicKeyBanxico } = getBanxicoCredentials();

    const isVerified = verifySignature(resultado, publicKeyBanxico);
    if (!isVerified) {
      console.log("Signature verification failed. Resultado -8");
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
        return res.status(200).json({
          resultado: checkResult,
          temp_request_body: req.body,
        });
      }
    }

    // If all checks pass
    console.log("All checks passed. Processing request.... Resultado 0");
    return res.status(200).json({
      resultado: 0,
    });
  },
};
