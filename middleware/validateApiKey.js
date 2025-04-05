const supabase = require("../config/supabase");
const apiKeyCache = require("../config/cache");

async function validateApiKey(req, res, next) {
  const userApiKey = req.headers["x-api-key"];
  if (!userApiKey) {
      return res.status(401).json({ error: "API Key missing" });
  }

  // Check if the API key is in the cache
  const cachedData = apiKeyCache.get(userApiKey);
  if (cachedData) {
      // If found in cache, use the cached value
      req.apiKey = cachedData.banxico_api_key;
      return next();
  }

  // If not in cache, look up the API key in Supabase
  const { data, error } = await supabase
      .from("api_keys")
      .select("banxico_api_key")
      .eq("api_key", userApiKey)
      .eq('active', true)
      .single();

  if (error || !data) {
      return res.status(403).json({ error: "Invalid API Key" });
  }

  // Store the API key data in cache
  apiKeyCache.set(userApiKey, data);

  // Attach the external API key to the request
  req.apiKey = data.banxico_api_key;
  next();
}

module.exports = { validateApiKey };
