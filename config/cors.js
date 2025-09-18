// CORS Configuration for CoDi API
// ================================

// Default CORS origins for development and open source use
const defaultOrigins = [
  // Local development ports
  "http://localhost:5173", // Vite default
  "http://localhost:2121",
  "http://localhost:3131",
  "http://localhost:3000", // Common React/Node default
];

// Helper function to parse comma-separated environment variables
const parseEnvOrigins = (envVar) => {
  return envVar ? envVar.split(',').map(origin => origin.trim()) : [];
};

// Load custom origins from environment variables
const customOrigins = parseEnvOrigins(process.env.CORS_ALLOWED_ORIGINS);

// Banxico origins (confidential IPs grouped by environment)
const banxicoBetaOrigins = parseEnvOrigins(process.env.CORS_BANXICO_BETA);
const banxicoProdOrigins = parseEnvOrigins(process.env.CORS_BANXICO_PROD);

// Combine all origins
const allowedOrigins = [
  ...defaultOrigins,
  ...customOrigins,
  ...banxicoBetaOrigins,
  ...banxicoProdOrigins,
];

module.exports = { allowedOrigins };