function checkDigit(resultado) {
  const digitoVerificadorCliente =
    resultado.cadenaInformacion.digitoVerificadorCliente;
  if (
    typeof digitoVerificadorCliente !== "number" ||
    digitoVerificadorCliente < 0 ||
    digitoVerificadorCliente > 999999999
  ) {
    throw new Error(
      "digitoVerificadorCliente must be a number between 0 and 999,999,999"
    );
  }
}

module.exports = {
  checkDigit,
};
