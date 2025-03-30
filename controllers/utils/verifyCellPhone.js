/**
 * Validates a cell phone number from the provided result object
 *
 * @param {Object} resultado - The result object containing user information
 * @param {Object} resultado.cadenaInformacion - Object containing client details
 * @param {string} resultado.cadenaInformacion.celularCliente - The client's cell phone number to validate
 *
 * @returns {number} 0 if validation passes, -3 if validation fails
 *
 * @description
 * Performs the following validations:
 * - Checks if the cell phone is a string
 * - Verifies it has exactly 10 characters
 * - Ensures all characters are digits
 */
function verifyCellPhone(resultado) {
  const celularCliente = resultado.cadenaInformacion.celularCliente;

  // Check if celularCliente is a string and has a length of 10
  if (typeof celularCliente !== "string" || celularCliente.length !== 10) {
    return -3;
  }

  // Check if all characters in celularCliente are digits
  for (let i = 0; i < celularCliente.length; i++) {
    if (isNaN(parseInt(celularCliente[i], 10))) {
      return -3;
    }
  }

  // If all checks pass
  return 0;
}

module.exports = {
  verifyCellPhone,
};
