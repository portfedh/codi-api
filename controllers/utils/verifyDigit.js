function verifyDigit(resultado) {
  const digitoVerificadorCliente =
    resultado.cadenaInformacion.digitoVerificadorCliente;

  if (
    typeof digitoVerificadorCliente !== "number" ||
    digitoVerificadorCliente < 0 ||
    digitoVerificadorCliente > 999999999
  ) {
    return -6;
  }

  // If all checks pass
  return 0;
}

module.exports = {
  verifyDigit,
};
