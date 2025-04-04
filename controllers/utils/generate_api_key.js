// To run, use: $ node generate_api_key.js

const crypto = require('crypto');

function generateApiKey() {
  return crypto.randomBytes(64).toString('hex');
}

const apiKey = generateApiKey();
console.log(apiKey);