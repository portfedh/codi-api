/**
 * Verifies the response received from Banxico API and determines if the transaction was successful.
 *
 * @param {Object} response - The response object from Banxico API
 * @param {Object} response.data - The data object contained in the response
 * @param {number} response.data.edoPet - Status code of the request (0 means success)
 * @param {string|null} [response.data.detalleEdoPet=null] - Detailed message about the request status, if available
 *
 * @returns {Object} Result object containing success status and error details if applicable
 * @returns {boolean} result.success - Whether the transaction was successful
 * @returns {string} [result.error] - Error message, present only when success is false
 * @returns {number} [result.errorCode] - Error code from Banxico, present only when success is false
 * @returns {string|null} [result.errorDetails] - Detailed error information, present only when success is false
 */
function verifyBanxicoResponse(response) {
  const { edoPet, detalleEdoPet = null } = response.data;

  if (edoPet !== 0) {
    return {
      success: false,
      error: "Transaction failed",
      errorCode: edoPet,
      errorDetails: detalleEdoPet,
    };
  }

  return { success: true };
}

module.exports = { verifyBanxicoResponse };
