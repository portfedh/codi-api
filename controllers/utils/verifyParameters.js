/**
 * Verifies that the provided `resultado` object contains all required fields and sub-fields.
 *
 * @param {Object} resultado - The object to validate.
 * @returns {number} - Returns 0 if all required fields and sub-fields are present.
 *                     Returns -6 if any required field or sub-field is missing.
 */
function verifyParameters(resultado) {
  const requiredFields = ["cadenaInformacion", "selloDigital"];

  const requiredSubFields = [
    "certComercioProveedor",
    "celularCliente",
    "digitoVerificadorCliente",
    "nombreCliente",
    "claveInstitucionCliente",
    "tipoCuentaCliente",
    "numeroCuentaCliente",
    "idMensajeCobro",
    "concepto",
    "monto",
    "claveRastreo",
    "resultadoMensajeCobro",
    "horaSolicitudMensajeCobro",
    "horaProcMensajeCobro",
    "certBdeM",
    "horaEnvioMensaje",
  ];

  // Check if all required fields exist
  for (const field of requiredFields) {
    if (!resultado.hasOwnProperty(field)) {
      return -1;
    }
  }

  // Check if all required sub-fields exist in cadenaInformación
  for (const subField of requiredSubFields) {
    if (!resultado.cadenaInformacion.hasOwnProperty(subField)) {
      return -1;
    }
  }

  // If all checks pass
  return 0;
}

module.exports = {
  verifyParameters,
};
