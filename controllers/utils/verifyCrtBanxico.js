const { getBanxicoCredentials } = require("./getBanxicoCredentials");

function verifyCrtBanxico(resultado) {
  const { crtBanxico } = getBanxicoCredentials(); 
  if (resultado.cadenaInformacion.certBdeM !== crtBanxico) {
    return -5;
  }
  // If all checks pass
  return 0;
}

module.exports = {
  verifyCrtBanxico,
};
