function checkCellPhone(resultado) {
  const celularCliente = resultado.cadenaInformacion.celularCliente;
  // Check if the length is exactly 10 and all characters are digits
  const isValid = celularCliente.length === 10 && !isNaN(celularCliente);

  if (!isValid) {
    throw new Error(
      "Invalid celularCliente: must be a string with exactly 10 digits."
    );
  }
}

module.exports = {
  checkCellPhone,
};
