function verifyResultadoMensajeDeCobro(resultado) {
  const validResults = [
    0, 1, 2, 3, 4, 6, 21, 22, 23, 24, 31, 32, 33, 34, 61, 62, 63,
  ];

  if (
    !resultado ||
    !resultado.cadenaInformacion ||
    !validResults.includes(resultado.cadenaInformacion.resultadoMensajeCobro)
  ) {
    return -6;
  }

  // If all checks pass
  return 0;
}

module.exports = {
  verifyResultadoMensajeDeCobro,
};
