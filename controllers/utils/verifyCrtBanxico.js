/**
 * Utility for verifying Banxico certificates.
 * @module verifyCrtBanxico
 */

const { getBanxicoCredentials } = require("./getBanxicoCredentials");

/**
 * Verifies if the Banxico certificate in the result matches the expected certificate.
 *
 * @param {Object} resultado - The result object containing certificate information
 * @param {Object} resultado.cadenaInformacion - Information chain object
 * @param {string} resultado.cadenaInformacion.certBdeM - Banxico certificate from the result
 * @returns {number} 0 if the certificate matches, -5 if it doesn't match
 */
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
