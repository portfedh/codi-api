const { getDeveloperCredentials } = require("./getDeveloperCredentials");

function verifyCrtDeveloper(resultado) {
  const { crtOper } = getDeveloperCredentials();
  if (resultado.cadenaInformacion.certComercioProveedor !== crtOper) {
    throw new Error("certComercioProveedor does not match crtOper");
  }
}

module.exports = {
  verifyCrtDeveloper,
};
