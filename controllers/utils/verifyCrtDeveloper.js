const { getDeveloperCredentials } = require("./getDeveloperCredentials");

function verifyCrtDeveloper(resultado) {
  const { crtOper } = getDeveloperCredentials();
  if (resultado.cadenaInformacion.certComercioProveedor !== crtOper) {
    return -4;
  }
  // If all checks pass
  return 0;
}

module.exports = {
  verifyCrtDeveloper,
};
