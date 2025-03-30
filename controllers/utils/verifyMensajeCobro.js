/**
 * Verifies if the payment message (mensaje de cobro) is valid
 *
 * @param {Object} resultado - The result object containing payment information
 * @param {Object} resultado.cadenaInformacion - Information chain object
 * @param {string} resultado.cadenaInformacion.concepto - The payment concept to verify
 *
 * @returns {number} 0 if the message is valid, -9 if invalid (not a string or empty)
 */
function verifyMensajeCobro(resultado) {
  const mensajeCobro = resultado.cadenaInformacion.concepto;
  if (typeof mensajeCobro !== "string") {
    return -9;
  }
  if (mensajeCobro.length < 1) {
    return -9;
  }
  return 0; // All checks pass
}

module.exports = {
  verifyMensajeCobro,
};
