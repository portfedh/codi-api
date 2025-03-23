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
      return -6;
    }
  }

  // Check if all required sub-fields exist in cadenaInformación
  for (const subField of requiredSubFields) {
    if (!resultado.cadenaInformacion.hasOwnProperty(subField)) {
      return -6;
    }
  }

  // If all checks pass
  return 0;
}

module.exports = {
  verifyParameters,
};
