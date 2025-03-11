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

module.exports = {
  getDeveloperCredentials,
};
