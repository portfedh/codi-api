/**
 * Returns the appropriate CODI QR URL endpoint based on the current environment.
 * Uses environment variables to determine which URL to return.
 *
 * @returns {string} The URL endpoint for CODI QR - returns production URL
 * (SITIO_CODI_QR_PROD_2) if NODE_ENV is "production", otherwise returns
 * development URL (SITIO_CODI_QR_DEV_2).
 */
function getCodiQrUrl() {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? process.env.SITIO_CODI_QR_PROD_2
      : process.env.SITIO_CODI_QR_DEV_2;
  return endPoint;
}

/**
 * Module exports.
 * @module controllers/utils/getCodiQrUrl
 */
module.exports = {
  getCodiQrUrl,
};
