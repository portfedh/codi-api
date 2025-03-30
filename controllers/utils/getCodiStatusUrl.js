/**
 * Retrieves the appropriate CODI status consultation URL based on the current environment.
 *
 * @returns {string} The CODI status consultation endpoint URL
 * @description Determines which endpoint to use by checking if the application
 *              is running in production. Returns the production URL if NODE_ENV
 *              is "production", otherwise returns the development URL.
 */
function getCodiStatusURL() {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? process.env.SITIO_CODI_CONSULTA_PROD_2
      : process.env.SITIO_CODI_CONSULTA_DEV_2;
  return endPoint;
}

/**
 * @module getCodiStatusUrl
 */
module.exports = {
  getCodiStatusURL,
};
