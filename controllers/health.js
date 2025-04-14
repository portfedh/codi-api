const supabase = require("../config/supabase");

/**
 * Checks the health of the server and database services.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response with the health status.
 */
const checkHealth = async (req, res) => {
  // Initialize the health object with default values
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      server: {
        status: "healthy", // Assume the server is healthy by default
      },
      database: {
        status: "pending", // Database status is pending until checked
      },
    },
  };

  let isHealthy = true; // Flag to track overall health status

  try {
    // Measure the response time of a simple database query
    const startTime = Date.now();
    const { data, error } = await supabase
      .from("api_keys")
      .select("count")
      .limit(1);
    const responseTime = Date.now() - startTime;

    if (error) {
      // If there's an error, mark the database as unhealthy and log the error
      health.services.database.status = "unhealthy";
      health.services.database.error = error.message;
      isHealthy = false;
    } else {
      // If the query succeeds, mark the database as healthy and log the response time
      health.services.database.status = "healthy";
      health.services.database.responseTime = responseTime;
    }
  } catch (error) {
    // Catch any unexpected errors and mark the database as unhealthy
    health.services.database.status = "unhealthy";
    health.services.database.error = error.message;
    isHealthy = false;
  }

  // If any service is unhealthy, update the overall status and return a 503 response
  if (!isHealthy) {
    health.status = "unhealthy";
    return res.status(503).json(health);
  }

  // If all services are healthy, return a 200 response with the health object
  return res.status(200).json(health);
};

module.exports = {
  /**
   * Health check controller.
   */
  checkHealth,
};
