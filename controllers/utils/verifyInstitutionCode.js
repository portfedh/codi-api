const {
  betaInstitutions,
  productionInstitutions,
} = require("../../config/institutions.js");

/**
 * Verifies if the provided institution code exists in the list of valid institutions.
 *
 * @param {object} resultado - An object containing the institution code to validate.
 *   - The institution code is extracted from `resultado.cadenaInformacion.claveInstitucionCliente`.
 * @returns {number} 0 if the institution code is valid, -1 if invalid.
 */
function verifyInstitutionCode(resultado) {
  // Extract the code from the object
  const institutionCode =
    resultado.cadenaInformacion?.claveInstitucionCliente?.toString();

  const allInstitutions = [...betaInstitutions, ...productionInstitutions];
  const isValid = allInstitutions.some(
    (institution) =>
      institution.clave_institucion.toString() === institutionCode
  );
  // console.log("IsValid:", isValid);
  // console.log("Institution Code:", institutionCode);

  return isValid ? 0 : -1;
}

module.exports = { verifyInstitutionCode };
