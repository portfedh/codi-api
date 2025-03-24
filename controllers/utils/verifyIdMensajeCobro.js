function verifyIdMensajeCobro(resultado) {
  const idMensajeCobro = resultado.cadenaInformacion.idMensajeCobro;
  if (typeof idMensajeCobro !== "string") {
    return -7;
  }
  if (idMensajeCobro.length !== 10 && idMensajeCobro.length !== 20) {
    return -7;
  }
  return 0; // All checks pass
}

module.exports = {
  verifyIdMensajeCobro,
};
