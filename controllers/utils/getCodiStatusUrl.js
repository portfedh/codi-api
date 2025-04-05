/**
 * Returns the appropriate CODI Status URL endpoints based on the current environment.
 * Uses environment variables to determine which URLs to return.
 *
 * @returns {Object} An object containing both primary and secondary URLs for the current environment
 */
function getCodiStatusUrls() {
  if (process.env.NODE_ENV === "production") {
    return {
      primary: process.env.SITIO_CODI_CONSULTA_PROD_1,
      secondary: process.env.SITIO_CODI_CONSULTA_PROD_2
    };
  }
  return {
    primary: process.env.SITIO_CODI_CONSULTA_DEV_1,
    secondary: process.env.SITIO_CODI_CONSULTA_DEV_2
  };
}

/**
 * Module exports.
 * @module controllers/utils/getCodiStatusUrl
 */
module.exports = {
  getCodiStatusUrls
};
