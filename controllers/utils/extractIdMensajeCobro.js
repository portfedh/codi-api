/**
 * Extracts the idMensajeCobro from the request body
 *
 * @param {Object} requestBody - The request body containing operation result data
 * @returns {string|null} - The extracted idMensajeCobro or null if not found
 */
function extractIdMensajeCobro(requestBody) {
  try {
    const idMensajeCobro = requestBody.cadenaInformacion.idMensajeCobro;

    if (!idMensajeCobro) {
      console.error("Error: idMensajeCobro not found in request body");
      return null;
    }

    // console.log(`Extracted idMensajeCobro: ${idMensajeCobro}`);
    return idMensajeCobro;
  } catch (error) {
    console.error("Error extracting idMensajeCobro:", error.message);
    return null;
  }
}

module.exports = { extractIdMensajeCobro };
