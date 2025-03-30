/**
 * Validates the idMensajeCobro field in the provided data object
 *
 * @param {Object} resultado - The object containing payment message data
 * @param {Object} resultado.cadenaInformacion - The information chain object
 * @param {string} resultado.cadenaInformacion.idMensajeCobro - The payment message ID to validate
 * @returns {number} 0 if validation passes, -7 if validation fails
 */
function verifyIdMensajeCobro(resultado) {
  const idMensajeCobro = resultado.cadenaInformacion.idMensajeCobro;
  if (typeof idMensajeCobro !== "string") {
    return -7;
  }
  if (idMensajeCobro.length !== 10 && idMensajeCobro.length !== 20) {
    return -7;
  }
  return 0; // All checks pass
}

/**
 * Module exports
 * @module verifyIdMensajeCobro
 */
module.exports = {
  verifyIdMensajeCobro,
};
