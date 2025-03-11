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
