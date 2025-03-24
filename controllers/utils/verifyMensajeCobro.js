function verifyMensajeCobro(resultado) {
  const mensajeCobro = resultado.cadenaInformacion.concepto;
  if (typeof mensajeCobro !== "string") {
    return -9;
  }
  if (mensajeCobro.length < 1) {
    return -9;
  }
  return 0; // All checks pass
}

module.exports = {
  verifyMensajeCobro,
};
