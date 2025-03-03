function getCodiPushUrl() {
  // To Do:
  // Entender por que hay dos sitios para pr
  const endPoint =
    process.env.NODE_ENV === "production"
      ? process.env.SITIO_CODI_PUSH_PROD_2
      : process.env.SITIO_CODI_PUSH_DEV_2;
  return endPoint;
}

module.exports = {
  getCodiPushUrl,
};
