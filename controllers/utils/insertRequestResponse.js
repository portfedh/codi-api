const supabase = require('../../config/supabase');

/**
 * Inserts an API request and its corresponding response into Supabase.
 *
 * @param {Object} params
 * @param {string} params.route - The API route (e.g., '/v2/codi/push').
 * @param {Object} params.requestHeaders - Request headers object
 * @param {Object} params.requestPayload - The request payload to log
 * @param {Date} params.requestTimestamp - Timestamp of the request.
 * @param {object} params.responsePayload - The response payload (JSON).
 * @param {number} params.responseStatus - The HTTP status code of the response.
 * @param {Date} params.responseTimestamp - Timestamp of the response.
 * @returns {Promise<void>}
 */
async function insertRequestResponse({
  route,
  requestHeaders,
  requestPayload,
  requestTimestamp,
  responsePayload,
  responseStatus,
  responseTimestamp
}) {
  try {
    // Get API key from request headers
    const apiKey = requestHeaders['x-api-key'];

    // Ensure timestamps are in ISO format
    const formattedRequestTimestamp = requestTimestamp.format()
    const formattedResponseTimestamp = responseTimestamp.format()

    // 1. Insert the request
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .insert([
        {
          route,
          request_payload: requestPayload,
          request_timestamp: formattedRequestTimestamp,
          api_key: apiKey
        },
      ])
      .select('id') //  Important: Retrieve the generated request ID
      .single();

    if (requestError) {
      console.error('Error inserting API request:', requestError);
      return; //  Or throw an error if you want to halt execution
    }

    const apiRequestId = requestData.id;

    // 2. Insert the response, linking it to the request
    const { error: responseError } = await supabase
      .from('responses')
      .insert([
        {
          api_request_id: apiRequestId,
          response_payload: responsePayload,
          response_timestamp: formattedResponseTimestamp,
          response_status: responseStatus,
        },
      ]);

    if (responseError) {
      console.error('Error inserting API response:', responseError);
    } else {
      console.log('API request and response logged successfully.');
    }
  } catch (error) {
    console.error('Error logging API data:', error);
  }
}

module.exports = { insertRequestResponse };