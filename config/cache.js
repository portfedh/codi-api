/**
 * @fileoverview Configuration for the caching mechanism using NodeCache.
 * This file sets up a cache instance with a default TTL of 1 hour and
 * checks for expired items every 10 minutes.
 */

const NodeCache = require("node-cache");

/**
 * Cache instance for storing API keys or other temporary data.
 *
 * @type {NodeCache}
 * @property {number} stdTTL - Default time-to-live (TTL) for all cache items in seconds (1 hour).
 * @property {number} checkperiod - Interval in seconds to check for expired items (10 minutes).
 */
const apiKeyCache = new NodeCache({
  stdTTL: 3600, // Default TTL for all items: 1 hour
  checkperiod: 600, // Check for expired items every 10 minutes
});

module.exports = apiKeyCache;
