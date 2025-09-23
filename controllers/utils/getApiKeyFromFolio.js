/**
 * Retrieves the API key associated with an idMensajeCobro
 * 
 * @param {string} idMensajeCobro - The idMensajeCobro to search for
 * @param {Object} supabase - The Supabase client
 * @returns {string|null} - The API key or null if not found
 */
async function getApiKeyFromFolio(idMensajeCobro, supabase) {
  try {
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
        return null;
      }
      
      folioData = shortFolioData;
    }
    
    if (!folioData || !folioData.api_key) {
      console.error(`No api_key found for idMensajeCobro: ${idMensajeCobro}`);
      return null;
    }
    
    const apiKey = folioData.api_key;
    // console.log(`Found api_key: ${apiKey}`);
    return apiKey;
  } catch (error) {
    console.error("Error retrieving API key:", error.message);
    return null;
  }
}

module.exports = { getApiKeyFromFolio };
