function verifyCellPhone(resultado) {
  const celularCliente = resultado.cadenaInformacion.celularCliente;

  // Check if celularCliente is a string and has a length of 10
  if (typeof celularCliente !== "string" || celularCliente.length !== 10) {
    return -3;
  }

  // Check if all characters in celularCliente are digits
  for (let i = 0; i < celularCliente.length; i++) {
    if (isNaN(parseInt(celularCliente[i], 10))) {
      return -3;
    }
  }

  // If all checks pass
  return 0;
}

module.exports = {
  verifyCellPhone,
};
