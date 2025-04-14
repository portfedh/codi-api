const crypto = require("crypto");
const { signData } = require("./signData");
const { cleanJsonObject } = require("./cleanJsonObject");
const { hasPipeCharacter } = require("./hasPipeCharacter");

/**
 * Generates a digital signature for the provided data object
 *
 * @async
 * @param {Object} object - The data object to be signed
 * @param {number|string} epoch - The timestamp to append to the data before signing
 * @returns {Promise<string>} The generated digital signature
 * @throws {Error} When data contains pipe characters or if signature generation fails
 *
 * @description
 * The function performs the following steps:
 * 1. Validates that input data doesn't contain pipe characters
 * 2. Cleans and processes the data object
 * 3. Stringifies the processed JSON and appends the epoch
 * 4. Signs the prepared data string
 */
async function generateSignature(object, epoch = "") {
  try {
    // console.log("\n Iniciando generación de sello digital...");
    // console.log("\n Datos recibidos: ", object);

    // Step 1: Validate input data
    if (hasPipeCharacter(object)) {
      throw new Error("Datos contienen el símbolo de | concatenar");
    }
    // console.log("\n Datos correctos: Sin símbolo de | concatenar");

    // Step 2: Transform and prepare the data
    const processedJson = cleanJsonObject(object);
    // console.log("\n Datos procesados: ", processedJson);

    // Step 3: Stringify JSON
    let stringifiedJson = `${JSON.stringify(processedJson)}${epoch}`;
    stringifiedJson = stringifiedJson.trim();
    // console.log("\n Datos a firmar con epoch:", stringifiedJson);

    // Step 4: Sign the data
    const signature = signData(stringifiedJson);
    // console.log("\n Firma generada: ", signature);

    return signature;
  } catch (error) {
    console.error("Error generating sello digital:", error);
    throw error;
  }
}

module.exports = {
  generateSignature,
};
