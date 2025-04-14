/**
 * Returns the appropriate CoDi Push URL endpoints based on the current environment.
 * Uses environment variables to determine which URLs to return.
 *
 * @returns {Object} An object containing both primary and secondary URLs for the current environment
 */
function getCodiPushUrls() {
  if (process.env.NODE_ENV === "production") {
    return {
      primary: process.env.SITIO_CODI_PUSH_PROD_1,
      secondary: process.env.SITIO_CODI_PUSH_PROD_2
    };
  }
  return {
    primary: process.env.SITIO_CODI_PUSH_DEV_1,
    secondary: process.env.SITIO_CODI_PUSH_DEV_2
  };
}

/**
 * Module exports.
 * @module controllers/utils/getCodiPushUrl
 */
module.exports = {
  getCodiPushUrls
};
