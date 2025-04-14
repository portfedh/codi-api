// To run, use: $ node generate_api_key.js

const crypto = require("crypto");

/**
 * Generates a random API key.
 *
 * @returns {string} A randomly generated API key in hexadecimal format.
 */
function generateApiKey() {
  return crypto.randomBytes(64).toString("hex");
}

const apiKey = generateApiKey();
console.log(apiKey);

module.exports = generateApiKey;

/**
 * To execute this script, open a terminal and navigate to the directory containing this file.
 * Then run the following command:
 *
 * $ node generate_api_key.js
 */
