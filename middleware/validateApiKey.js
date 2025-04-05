const supabase = require("../config/supabase");


async function validateApiKey(req, res, next) {
  const userApiKey = req.headers["x-api-key"];
  if (!userApiKey) {
      return res.status(401).json({ error: "API Key missing" });
  }

  // Look up the API key in Supabase
  const { data, error } = await supabase
      .from("api_keys")
      .select("banxico_api_key")
      .eq("api_key", userApiKey)
      .eq('active', true)
      .single();

  if (error || !data) {
      return res.status(403).json({ error: "Invalid API Key" });
  }

  // Attach the external API key to the request
  req.apiKey = data.banxico_api_key;
  next();
}

module.exports = { validateApiKey };
