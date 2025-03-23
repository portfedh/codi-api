function checkResultadoMensajeDeCobro(resultado) {
  const validResults = [
    0, 1, 2, 3, 4, 6, 21, 22, 23, 24, 31, 32, 33, 34, 61, 62, 63,
  ];
  if (
    !validResults.includes(resultado.cadenaInformacion.resultadoMensajeCobro)
  ) {
    return -6;
  }
}

module.exports = {
  checkResultadoMensajeDeCobro,
};
