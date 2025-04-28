const supabase = require("../config/supabase");
const apiKeyCache = require("../config/cache");

/**
 * Middleware to validate the API key provided in the request headers.
 *
 * This function checks if the API key exists in the cache. If not, it queries
 * the Supabase database to validate the key. If the key is valid, it attaches
 * the corresponding external API key to the request object.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.headers - The headers of the request.
 * @param {string} req.headers["x-api-key"] - The API key provided in the request headers.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} Sends a response with an error message if the API key is missing or invalid.
 * Otherwise, calls the `next` middleware function.
 */
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
    .eq("active", true)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Invalid API Key" });
  }

  // Store the API key data in cache
  apiKeyCache.set(userApiKey, data);

  // Attach the external API key to the request
  req.apiKey = data.banxico_api_key;
  next();
}

module.exports = { validateApiKey };
