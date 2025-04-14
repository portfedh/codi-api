/**
 * Retrieves the appropriate developer credentials based on the current environment.
 * Uses different credential values for production and development environments.
 *
 * @function getDeveloperCredentials
 * @returns {Object} An object containing credential certificates:
 * @returns {string} crtLogIn - The login certificate for authentication
 * @returns {string} crtOper - The operation certificate for transactions
 */
function getDeveloperCredentials() {
  const crtLogIn =
    process.env.NODE_ENV === "production"
      ? process.env.CRT_LOG_IN_PROD
      : process.env.CRT_LOG_IN_DEV;
  const crtOper =
    process.env.NODE_ENV === "production"
      ? process.env.CRT_OPER_PROD
      : process.env.CRT_OPER_DEV;
  return { crtLogIn, crtOper };
}

/**
 * Module exports
 * @module getDeveloperCredentials
 */
module.exports = {
  getDeveloperCredentials,
};
