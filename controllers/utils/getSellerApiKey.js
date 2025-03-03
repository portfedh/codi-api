function getSellerApiKey() {
  const apiKey =
    process.env.NODE_ENV === "production"
      ? process.env.API_KEY_PROD
      : process.env.API_KEY_BETA;
  return apiKey;
}

module.exports = {
  getSellerApiKey,
};
