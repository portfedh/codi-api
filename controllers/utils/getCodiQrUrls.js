/**
 * Returns the appropriate CoDi QR URL endpoints based on the current environment.
 * Uses environment variables to determine which URLs to return.
 *
 * @returns {Object} An object containing both primary and secondary URLs for the current environment
 */
function getCodiQrUrls() {
  if (process.env.NODE_ENV === "production") {
    return {
      primary: process.env.SITIO_CODI_QR_PROD_1,
      secondary: process.env.SITIO_CODI_QR_PROD_2
    };
  }
  return {
    primary: process.env.SITIO_CODI_QR_DEV_1,
    secondary: process.env.SITIO_CODI_QR_DEV_2
  };
}

/**
 * Module exports.
 * @module controllers/utils/getCodiQrUrl
 */
module.exports = {
  getCodiQrUrls
};
