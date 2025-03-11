const crypto = require("crypto");
const forge = require("node-forge");
const { getKeyCredentials } = require("./getKeyCredentials");

function signData(string) {
  try {
    // Read private key from environment variables
    const { privateKey, privateKeyPassphrase } = getKeyCredentials();
    const privateKeyPem = privateKey;
    const passphrase = privateKeyPassphrase;
    // console.log("\nEncrypted Private Key: ", privateKeyPem);
    // console.log("\nPassphrase: ", passphrase);

    // Decrypt the private key
    const decryptedPrivateKey = forge.pki.decryptRsaPrivateKey(
      privateKeyPem,
      passphrase
    );
    // console.log("\nDecrypted Private Key: ", decryptedPrivateKey);

    if (!decryptedPrivateKey) {
      throw new Error("\nFailed to decrypt private key");
    }

    // Convert the private key to PEM format
    const privateKeyPemString = forge.pki.privateKeyToPem(decryptedPrivateKey);
    // console.log("\nPrivate Key PEM String: ", privateKeyPemString);

    // Create signer
    const signer = crypto.createSign("RSA-SHA512");
    signer.update(string);
    // console.log("\nSigner Object: ", signer);

    // Sign the string with PSS padding
    const signature = signer.sign({
      key: privateKeyPemString,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST, //64 bits checar con openSSL
    });
    // console.log("\nHex Signature: ", signature);

    // Convert to base64
    const signatureBase64 = signature.toString("base64");
    // console.log("\nSignature Base 64: ", signatureBase64);
    return signatureBase64;
  } catch (error) {
    console.error("Error signing hash:", error);
    throw new Error("Failed to sign hash with private key");
  }
}

module.exports = {
  signData,
};
