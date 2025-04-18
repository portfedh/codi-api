/**
 * Verifies the validity of the `resultadoMensajeCobro` field in the `resultado` object.
 *
 * @param {Object} resultado - The object containing the `cadenaInformacion` field.
 * @param {Object} [resultado.cadenaInformacion] - The nested object containing `resultadoMensajeCobro`.
 * @param {number} [resultado.cadenaInformacion.resultadoMensajeCobro] - The result code to validate.
 * @returns {number} - Returns 0 if valid, otherwise returns -6.
 */
function verifyResultadoMensajeDeCobro(resultado) {
  // Source: Anexo D - Catalogo de estado de mensajes de cobro. Documentación Banxico
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
