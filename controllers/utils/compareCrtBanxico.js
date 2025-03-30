/**
 * Compares a Banxico certificate with the certificate stored in the data object
 *
 * @param {string} crtBanxico - The Banxico certificate to compare
 * @param {Object} data - The data object containing the certificate
 * @param {string} data.crtBdeM - The certificate from Banco de México to compare against
 * @returns {boolean} - Returns true if certificates match, false otherwise
 */
function compareCrtBanxico(crtBanxico, data) {
  if (crtBanxico === data.crtBdeM) {
    return true;
  } else {
    console.error(
      "Mismatch: data.crtBdeM does not match with crtBanxico public key"
    );
    return false;
  }
}

module.exports = {
  compareCrtBanxico,
};
