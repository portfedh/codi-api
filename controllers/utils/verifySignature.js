const crypto = require("crypto");
const forge = require("node-forge");

function verifySignature(object, publicKeyCertificate) {
  try {
    // console.log("Iniciando proceso de verificación de firma");
    // console.log("\nCertificado Publico: ", publicKeyCertificate);
    // console.log("\nObjeto a verificar: ", object);

    // Convert the certificate from PEM format to a forge certificate object
    const cert = forge.pki.certificateFromPem(publicKeyCertificate);
    // console.log("\nCertificado: ", cert);
    // Extract the public key from the certificate
    const publicKey = forge.pki.publicKeyToPem(cert.publicKey);
    // console.log("\nLlave pública: ", publicKey);

    // Prepare the data to be verified
    const signatureBase64 = object.selloDigital;
    // console.log("\nFirma a verificar: ", signatureBase64);
    const inputJson =
      object.datosMC ||
      object.peticionConsulta ||
      object.cadenaMC ||
      object.folioCodi ||
      object.cadenaInformacion;
    console.log("\nDatos a verificar:", inputJson);
    const epoch = object.epoch || object.cadenaInformacion.horaEnvioMensaje;
    console.log("\nEpoch a verificar:", epoch);

    const jsonString =
      typeof inputJson === "string" ? inputJson : JSON.stringify(inputJson);
    const stringifiedJson = `${jsonString}${epoch}`;
    // console.log("\nDatos a verificar stringify con epoch:", stringifiedJson);

    // Create verifier
    const verifier = crypto.createVerify("RSA-SHA512");
    verifier.update(stringifiedJson);
    // console.log("\nVerifier Object: ", verifier);

    // Verify the signature with PSS padding
    const isVerified = verifier.verify(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      },
      signatureBase64,
      "base64"
    );
    // console.log("\nFirma verificada: ", isVerified);
    return isVerified;
  } catch (error) {
    console.error("Error verifying signature:", error);
    throw new Error("Failed to verify signature");
  }
}

module.exports = {
  verifySignature,
};
