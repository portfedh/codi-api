/**
 * Returns the appropriate CODI push notification URL based on the current environment.
 *
 * @returns {string} The endpoint URL for CODI push notifications. Returns the production
 * URL if NODE_ENV is set to "production", otherwise returns the development URL.
 */
function getCodiPushUrl() {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? process.env.SITIO_CODI_PUSH_PROD_2
      : process.env.SITIO_CODI_PUSH_DEV_2;
  return endPoint;
}

/**
 * @module getCodiPushUrl
 */
module.exports = {
  getCodiPushUrl,
};
