const crypto = require("crypto");
const forge = require("node-forge");
const formatMonto = require("./formatMonto");

function verifySignature(object, publicKeyCertificate) {
  try {
    // console.log("\nIniciando proceso de verificación de firma:");
    // console.log("\nCertificado Publico: ", publicKeyCertificate);
    // console.log("\nObjeto a verificar: ", object);

    // Convert the certificate from PEM format to a forge certificate object
    const cert = forge.pki.certificateFromPem(publicKeyCertificate);
    // console.log("\nCertificado forge: ", cert);

    // Extract the public key from the certificate
    const publicKey = forge.pki.publicKeyToPem(cert.publicKey);
    // console.log("\nLlave pública de cert forge: ", publicKey);

    // Determine which property to use as input and apply specific logic
    let sourceType;
    let inputJson;
    let epoch;
    let jsonString;
    let stringifiedJson;
    let signatureBase64;

    // Request: QR or Push
    if (object.datosMC) {
      console.log("\nCase: Req. Mensaje de Cobro via QR o Push");
      sourceType = "datosMC";
      inputJson = object.datosMC;
      epoch = object.epoch;
      jsonString =
        typeof inputJson === "string" ? inputJson : JSON.stringify(inputJson);
      stringifiedJson = `${jsonString}${epoch}`;
      signatureBase64 = object.selloDigital;

      // Response: QR
    } else if (object.cadenaMC) {
      console.log("\nCase: Res. Mensaje de Cobro via QR");
      sourceType = "cadenaMC";
      inputJson = object.cadenaMC;
      epoch = object.epoch;
      jsonString =
        typeof inputJson === "string" ? inputJson : JSON.stringify(inputJson);
      stringifiedJson = `${jsonString}${epoch}`;
      signatureBase64 = object.selloDigital;

      // Response: Push
    } else if (object.folioCodi) {
      console.log("\nCase: Res. Mensaje de Cobro via Push");
      sourceType = "folioCodi";
      inputJson = object.folioCodi;
      epoch = object.epoch;
      jsonString =
        typeof inputJson === "string" ? inputJson : JSON.stringify(inputJson);
      stringifiedJson = `${jsonString}${epoch}`;
      signatureBase64 = object.selloDigital;

      // Request: Consulta
    } else if (object.peticionConsulta) {
      console.log("\nCase: Req. Consulta Estado Mensaje de Cobro");
      sourceType = "peticionConsulta";
      inputJson = object.peticionConsulta;
      epoch = object.epoch;
      jsonString =
        typeof inputJson === "string" ? inputJson : JSON.stringify(inputJson);
      stringifiedJson = `${jsonString}${epoch}`;
      signatureBase64 = object.selloDigital;

      // Response: Consulta
    } else if (object.resultado) {
      console.log("\nProcesando: Res. Resultado Estado Mensaje de Cobro V2");
      sourceType = "resultado";
      inputJson = object.resultado;
      epoch = object.epoch;
      jsonString =
        typeof inputJson === "string" ? inputJson : JSON.stringify(inputJson);
      stringifiedJson = `${jsonString}${epoch}`;
      signatureBase64 = object.selloDigital;

      // Request: Resultado Operaciones
    } else if (object.cadenaInformacion) {
      inputJson = object.cadenaInformacion;
      jsonString =
        typeof inputJson === "string" ? inputJson : JSON.stringify(inputJson);
      stringifiedJson = formatMonto(jsonString);
      signatureBase64 = object.selloDigital;

      // Error: No valid data found
    } else {
      throw new Error("No valid data found in the object");
    }

    console.log(`\nFuente a verificar: ${sourceType}`);
    console.log("\nDatos a verificar:", inputJson);
    console.log("\nEpoch a verificar:", epoch);
    console.log("\nCadena a verificar:", stringifiedJson);
    console.log("\nFirma a verificar:", signatureBase64);
    console.log("\nDatos a verificar stringify con epoch:", stringifiedJson);

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
