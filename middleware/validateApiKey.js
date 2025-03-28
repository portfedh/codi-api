const { getSellerApiKey } = require("../controllers/utils/getSellerApiKey");

function validateApiKey(req, res, next) {
  // API key from request headers
  const clientApiKey = req.headers["x-api-key"];
  // Retrieve the valid API key from environment variables
  const validApiKey = getSellerApiKey();

  if (!clientApiKey || clientApiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: "Invalid or missing API key",
    });
  }

  next();
}

module.exports = { validateApiKey };
