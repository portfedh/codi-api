const axios = require("axios");

/**
 * Makes a request to a primary URL with a timeout, falling back to a secondary URL if needed.
 *
 * @param {string} primaryUrl - The primary URL to try first
 * @param {string} secondaryUrl - The fallback URL to try if primary fails
 * @param {Object} requestData - The data to send in the request
 * @param {Object} options - Additional options
 * @param {number} [options.timeout=3000] - Timeout in milliseconds before trying secondary URL
 * @returns {Promise<Object>} The response from the successful request, including the URL and response object
 * @throws {Error} If both requests fail, includes error messages from both attempts
 */
async function makeRequestWithFallback(
  primaryUrl,
  secondaryUrl,
  requestData,
  options = {}
) {
  const { timeout = 10000 } = options;

  // console.log("Request Data:", requestData);

  // Function to make a request with timeout
  const makeRequest = async (url) => {
    try {
      const response = await axios.post(url, requestData, {
        timeout,
        headers: {
          "Content-Type": "text/plain",
        },
      });

      return { url, response };
    } catch (error) {
      return { url, error };
    }
  };

  // Try primary URL first
  const primaryResult = await makeRequest(primaryUrl);
  if (primaryResult.response) {
    return primaryResult.response;
  }

  // If primary fails, try secondary URL
  const secondaryResult = await makeRequest(secondaryUrl);
  if (secondaryResult.response) {
    return secondaryResult.response;
  }

  throw new Error(
    `Both requests failed. Primary error: ${primaryResult.error?.message}, Secondary error: ${secondaryResult.error?.message}`
  );
}

module.exports = {
  makeRequestWithFallback,
};
