const NodeCache = require('node-cache');

// Create a cache instance with:
// - 1 hour TTL (3600 seconds)
// - Check for expired items every 10 minutes (600 seconds)
const apiKeyCache = new NodeCache({
    stdTTL: 3600,        // Default TTL for all items: 1 hour
    checkperiod: 600     // Check for expired items every 10 minutes
});

module.exports = apiKeyCache; 