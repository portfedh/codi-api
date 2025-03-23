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
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Check if all required sub-fields exist in cadenaInformacion
  for (const subField of requiredSubFields) {
    if (!resultado.cadenaInformacion.hasOwnProperty(subField)) {
      throw new Error(
        `Missing required sub-field in cadenaInformacion: ${subField}`
      );
    }
  }
}

module.exports = {
  verifyParameters,
};
