const crypto = require("crypto");
const { signData } = require("./signData");
const { cleanJsonObject } = require("./cleanJsonObject");
const { hasPipeCharacter } = require("./hasPipeCharacter");

async function generateSignature(object) {
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
    const epoch = Date.now();
    const stringifiedJson = JSON.stringify(processedJson) + epoch;
    // console.log("\n Datos a firmar con epoch: ", stringifiedJson);

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
