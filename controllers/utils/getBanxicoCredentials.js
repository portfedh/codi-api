/**
 * Retrieves Banxico credentials based on the current environment
 *
 * @description Selects the appropriate Banxico certificates and public keys
 * for either production or beta (development) environment based on the
 * NODE_ENV environment variable
 *
 * @returns {Object} Object containing Banxico credentials
 * @returns {string} returns.crtBanxico - The Banxico certificate for the current environment
 * @returns {string} returns.publicKeyBanxico - The Banxico public key for the current environment
 */
function getBanxicoCredentials() {
  const crtBanxico =
    process.env.NODE_ENV === "production"
      ? process.env.CRT_BANXICO_PROD
      : process.env.CRT_BANXICO_BETA;
  const publicKeyBanxico =
    process.env.NODE_ENV === "production"
      ? process.env.PUBLIC_KEY_BANXICO_PROD
      : process.env.PUBLIC_KEY_BANXICO_BETA;
  return { crtBanxico, publicKeyBanxico };
}

module.exports = {
  getBanxicoCredentials,
};
