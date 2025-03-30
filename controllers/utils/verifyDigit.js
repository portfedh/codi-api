/**
 * Validates the client verification digit from the transaction information
 *
 * @param {Object} resultado - The transaction information object
 * @param {Object} resultado.cadenaInformacion - Information chain object
 * @param {number} resultado.cadenaInformacion.digitoVerificadorCliente - Client verification digit
 *
 * @returns {number} 0 if verification is successful, -6 if verification fails
 */
function verifyDigit(resultado) {
  const digitoVerificadorCliente =
    resultado.cadenaInformacion.digitoVerificadorCliente;

  if (
    typeof digitoVerificadorCliente !== "number" ||
    digitoVerificadorCliente < 0 ||
    digitoVerificadorCliente > 999999999
  ) {
    return -6;
  }

  // If all checks pass
  return 0;
}

module.exports = {
  verifyDigit,
};
