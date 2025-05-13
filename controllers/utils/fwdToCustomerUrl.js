/**
 * Forwards operation results to customer callback URL
 *
 * This function extracts the idMensajeCobro from the request body, queries the
 * folios_codi table to get the api_key, then queries the api_keys table to get
 * the callback_url, and finally forwards the original request along with
 * validation results to that URL.
 *
 * @param {Object} requestBody - The request body containing operation result data
 * @param {number} validationResult - The validation result code
 * @returns {Promise<void>}
 */

const supabase = require("../../config/supabase");
const { extractIdMensajeCobro } = require("./extractIdMensajeCobro");
const { getApiKeyFromFolio } = require("./getApiKeyFromFolio");
const { getCallbackUrl } = require("./getCallbackUrl");
const { forwardRequest } = require("./forwardRequest");

async function fwdToCustomerUrl(requestBody, validationResult) {
  try {
    // Extract idMensajeCobro from the request body
    const idMensajeCobro = extractIdMensajeCobro(requestBody);
    if (!idMensajeCobro) return;
    
    // Get API key from folios_codi table
    const apiKey = await getApiKeyFromFolio(idMensajeCobro, supabase);
    if (!apiKey) return;
    
    // Get callback URL from api_keys table
    const callbackUrl = await getCallbackUrl(apiKey, supabase);
    if (!callbackUrl) return;
    
    // Forward the request to the callback URL
    await forwardRequest(callbackUrl, requestBody, validationResult);
  } catch (error) {
    console.error("Error in fwdToCustomerUrl:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}

module.exports = { fwdToCustomerUrl };
