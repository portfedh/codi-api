function getCodiQrUrl() {
  const endPoint =
    process.env.NODE_ENV === "production"
      ? process.env.SITIO_CODI_QR_PROD_2
      : process.env.SITIO_CODI_QR_DEV_2;
  return endPoint;
}

module.exports = {
  getCodiQrUrl,
};
