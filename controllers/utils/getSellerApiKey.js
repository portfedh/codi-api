/**
 * Retrieves the appropriate API key based on the current environment.
 *
 * @returns {string} The API key for the current environment:
 *                   API_KEY_PROD for production or API_KEY_BETA for non-production.
 */
function getSellerApiKey() {
  const apiKey =
    process.env.NODE_ENV === "production"
      ? process.env.API_KEY_PROD
      : process.env.API_KEY_BETA;
  return apiKey;
}

module.exports = {
  getSellerApiKey,
};
