function verifyTimeStamps(resultado) {
  const { horaSolicitudMensajeCobro, horaProcMensajeCobro, horaEnvioMensaje } =
    resultado.cadenaInformacion;

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
