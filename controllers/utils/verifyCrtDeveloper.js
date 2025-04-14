/**
 * Utility for verifying developer certificates in CODI transactions
 * @module verifyCrtDeveloper
 */
const { getDeveloperCredentials } = require("./getDeveloperCredentials");

/**
 * Verifies if the provider certificate in the result matches the developer's operation certificate
 *
 * @param {Object} resultado - The transaction result object to verify
 * @param {Object} resultado.cadenaInformacion - Information chain object from the result
 * @param {string} resultado.cadenaInformacion.certComercioProveedor - Provider's certificate to verify
 *
 * @returns {number} Status code indicating verification result:
 *   0: Verification successful (certificates match)
 *  -4: Certificate mismatch (certificates do not match)
 */
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
