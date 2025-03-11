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
