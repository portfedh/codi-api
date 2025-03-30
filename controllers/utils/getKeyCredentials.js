/**
 * Retrieves the appropriate key credentials based on the current environment.
 * Selects between production and development keys according to NODE_ENV.
 *
 * @returns {Object} An object containing credential keys
 * @returns {string} returns.privateKey - The private key for the current environment
 * @returns {string} returns.privateKeyPassphrase - The passphrase for the private key
 * @returns {string} returns.publicKey - The public key for the current environment
 */
function getKeyCredentials() {
  const privateKey =
    process.env.NODE_ENV === "production"
      ? process.env.PRIVATE_KEY_PROD
      : process.env.PRIVATE_KEY_DEV;
  const privateKeyPassphrase =
    process.env.NODE_ENV === "production"
      ? process.env.PRIVATE_KEY_PASSPHRASE_PROD
      : process.env.PRIVATE_KEY_PASSPHRASE_DEV;
  const publicKey =
    process.env.NODE_ENV === "production"
      ? process.env.PUBLIC_KEY_PROD
      : process.env.PUBLIC_KEY_DEV;
  return { privateKey, privateKeyPassphrase, publicKey };
}

module.exports = {
  getKeyCredentials,
};
