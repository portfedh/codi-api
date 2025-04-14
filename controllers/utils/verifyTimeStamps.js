/**
 * Verifies the timestamps in the provided result object to ensure they follow a specific order.
 *
 * @param {Object} resultado - The result object containing the timestamps to verify.
 * @param {Object} resultado.cadenaInformacion - The nested object containing the timestamps.
 * @param {string} resultado.cadenaInformacion.horaSolicitudMensajeCobro - The timestamp for the message request.
 * @param {string} resultado.cadenaInformacion.horaProcMensajeCobro - The timestamp for the message processing.
 * @param {string} resultado.cadenaInformacion.horaEnvioMensaje - The timestamp for the message sending.
 * @returns {number} Returns 0 if all checks pass, or -10 if any timestamp order is invalid.
 */
function verifyTimeStamps(resultado) {
  const { horaSolicitudMensajeCobro, horaProcMensajeCobro, horaEnvioMensaje } =
    resultado.cadenaInformacion;

  // Check if any timestamp is missing or undefined
  if (
    horaSolicitudMensajeCobro === undefined ||
    horaProcMensajeCobro === undefined ||
    horaEnvioMensaje === undefined
  ) {
    return -10; // Return -10 if any timestamp is missing
  }

  if (horaSolicitudMensajeCobro >= horaProcMensajeCobro) {
    return -10; // horaSolicitudMensajeCobro should be before horaProcMensajeCobro
  }

  if (horaProcMensajeCobro >= horaEnvioMensaje) {
    return -10; // horaProcMensajeCobro should be before horaEnvioMensaje
  }

  return 0; // All checks pass
}

module.exports = {
  verifyTimeStamps,
};
