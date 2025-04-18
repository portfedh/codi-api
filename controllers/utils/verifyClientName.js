/**
 * Verifies that the `nombreCliente` field in the `resultado` object is valid.
 *
 * @param {Object} resultado - The object containing the `nombreCliente` field.
 * @returns {number} - Returns 0 if valid, -1 if invalid.
 */
function verifyClientName(resultado) {
  const nombreCliente = resultado?.cadenaInformacion?.nombreCliente;

  // Check if nombreCliente exists and is a string
  if (typeof nombreCliente !== "string") {
    return -1;
  }

  // Check if nombreCliente is alphanumeric, allows asterisks, whitespace, accented letters, and is up to 40 characters long
  const isValid = /^[a-zA-Z0-9 *áéíóúÁÉÍÓÚñÑüÜ]{1,40}$/.test(nombreCliente);

  return isValid ? 0 : -1;
}

module.exports = {
  verifyClientName,
};
