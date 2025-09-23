/**
 * Retrieves the callback URL associated with an API key
 *
 * @param {string} apiKey - The API key to search for
 * @param {Object} supabase - The Supabase client
 * @returns {string|null} - The callback URL or null if not found
 */
async function getCallbackUrl(apiKey, supabase) {
  try {
    // Query the api_keys table for the callback_url
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("callback_url")
      .eq("api_key", apiKey)
      .single();

    if (apiKeyError) {
      console.error("Error querying api_keys table:", apiKeyError);
      return null;
    }

    if (!apiKeyData || !apiKeyData.callback_url) {
      console.error(`No callback_url found for api_key: ${apiKey}`);
      return null;
    }

    const callbackUrl = apiKeyData.callback_url;
    // console.log(`Found callback_url: ${callbackUrl}`);
    return callbackUrl;
  } catch (error) {
    console.error("Error retrieving callback URL:", error.message);
    return null;
  }
}

module.exports = { getCallbackUrl };
