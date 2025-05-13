/**
 * Forwards the request body to a callback URL
 * 
 * @param {string} callbackUrl - The URL to forward the request to
 * @param {Object} requestBody - The request body to forward
 * @param {number} validationResult - The validation result code
 * @returns {Object|null} - The response from the forwarded request or null if there was an error
 */
async function forwardRequest(callbackUrl, requestBody, validationResult) {
  try {
    const axios = require("axios");
    
    // Forward the request to the callback URL
    const forwardResponse = await axios.post(callbackUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Validation-Result": validationResult,
      },
    });
    
    console.log(`Request forwarded to ${callbackUrl}, status: ${forwardResponse.status}`);
    return forwardResponse;
  } catch (error) {
    console.error("Error forwarding request:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
}

module.exports = { forwardRequest };
