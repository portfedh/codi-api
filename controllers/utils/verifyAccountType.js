/**
 * Validates the account type from the provided result object
 *
 * @param {Object} resultado - The result object containing user information
 * @param {Object} resultado.cadenaInformacion - Object containing client details
 * @param {number} resultado.cadenaInformacion.tipoCuentaCliente - The client's account type to validate
 *
 * @returns {number} 0 if validation passes, -1 if validation fails
 *
 * @description
 * Performs the following validations:
 * - Checks if tipoCuentaCliente is one of the valid numbers: 40 CLABE, 3 Tarjeta Débito, or 10 Teléfono Celular
 */
function verifyAccountType(resultado) {
  const tipoCuentaCliente = resultado.cadenaInformacion.tipoCuentaCliente;

  // Check if tipoCuentaCliente is one of the valid numbers
  const validAccountTypes = [40, 3, 10];
  if (!validAccountTypes.includes(tipoCuentaCliente)) {
    return -1;
  }

  // If validation passes
  return 0;
}

module.exports = {
  verifyAccountType,
};
