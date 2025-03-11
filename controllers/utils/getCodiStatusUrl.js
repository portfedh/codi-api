function getCodiStatusURL() {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? process.env.SITIO_CODI_CONSULTA_PROD_2
      : process.env.SITIO_CODI_CONSULTA_DEV_2;
  return endPoint;
}

module.exports = {
  getCodiStatusURL,
};
