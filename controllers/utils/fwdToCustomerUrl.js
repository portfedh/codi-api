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

const axios = require("axios");
const supabase = require("../../config/supabase");

async function fwdToCustomerUrl(requestBody, validationResult) {
  try {
    // Extract idMensajeCobro from the request body
    const idMensajeCobro = requestBody.cadenaInformacion.idMensajeCobro;
    
    if (!idMensajeCobro) {
      console.error("Error: idMensajeCobro not found in request body");
      return;
    }
    
    console.log(`Extracted idMensajeCobro: ${idMensajeCobro}`);
    
    // Search for the idMensajeCobro in the folios_codi table
    let { data: folioData, error: folioError } = await supabase
      .from("folios_codi")
      .select("api_key")
      .eq("folio_codi", idMensajeCobro)
      .single();
    
    // If not found, try with the first 10 characters
    if (folioError || !folioData) {
      console.log(`No record found for full idMensajeCobro, trying first 10 characters`);
      
      const shortIdMensajeCobro = idMensajeCobro.substring(0, 10);
      const { data: shortFolioData, error: shortFolioError } = await supabase
        .from("folios_codi")
        .select("api_key")
        .eq("folio_codi", shortIdMensajeCobro)
        .single();
      
      if (shortFolioError) {
        console.error("Error querying folios_codi with shortened idMensajeCobro:", shortFolioError);
        return;
      }
      
      folioData = shortFolioData;
    }
    
    if (!folioData || !folioData.api_key) {
      console.error(`No api_key found for idMensajeCobro: ${idMensajeCobro}`);
      return;
    }
    
    const apiKey = folioData.api_key;
    console.log(`Found api_key: ${apiKey}`);
    
    // Query the api_keys table for the callback_url
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("callback_url")
      .eq("api_key", apiKey)
      .single();
    
    if (apiKeyError) {
      console.error("Error querying api_keys table:", apiKeyError);
      return;
    }
    
    if (!apiKeyData || !apiKeyData.callback_url) {
      console.error(`No callback_url found for api_key: ${apiKey}`);
      return;
    }
    
    const callbackUrl = apiKeyData.callback_url;
    console.log(`Found callback_url: ${callbackUrl}`);
    
    // Forward the request to the callback URL
    const forwardResponse = await axios.post(callbackUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Validation-Result": validationResult,
      },
    });
    
    console.log(`Request forwarded to ${callbackUrl}, status: ${forwardResponse.status}`);
  } catch (error) {
    console.error("Error in fwdToCustomerUrl:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}

module.exports = { fwdToCustomerUrl };
