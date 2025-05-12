const supabase = require("../../config/supabase");
const environment = process.env.NODE_ENV || "N/A";
/**
 * Inserts an API request and its corresponding response into Supabase.
 *
 * Steps performed by this function:
 * 1. Inserts the received API request into the "requests" table, including the full request payload and the original request object.
 * 2. Inserts the corresponding API response into the "responses" table, linking it to the request.
 * 3. If the response contains a "folioCodi" field, saves it to the "folios_codi" table.
 * 4. If the response contains a "cadenaMC" field, parses it, extracts the "IDC" value (if present), and saves it as a folio in "folios_codi".
 *
 * @param {Object} params
 * @param {string} params.route - The API route (e.g., '/v2/codi/push').
 * @param {Object} params.requestHeaders - Request headers object.
 * @param {Object} params.requestPayload - The request payload to log.
 * @param {Object} params.requestObject - The original request object received by the server.
 * @param {Date} params.requestTimestamp - Timestamp of the request (must support `.format()` method).
 * @param {Object} params.responsePayload - The response payload (JSON).
 * @param {number} params.responseStatus - The HTTP status code of the response.
 * @param {Date} params.responseTimestamp - Timestamp of the response (must support `.format()` method).
 * @returns {Promise<void>} Logs the request and response to the database. Errors are logged to the console.
 */
async function insertRequestResponse({
  route,
  requestHeaders,
  requestPayload,
  requestObject,
  requestTimestamp,
  responsePayload,
  responseStatus,
  responseTimestamp,
}) {
  try {
    // Get API key from request headers
    const apiKey = requestHeaders["x-api-key"];

    // Ensure timestamps are in ISO format
    const formattedRequestTimestamp = requestTimestamp.format();
    const formattedResponseTimestamp = responseTimestamp.format();

    // 1. Insert the received request
    const { data: requestData, error: requestError } = await supabase
      .from("requests")
      .insert([
        {
          route,
          request_payload: requestPayload,
          request_object: requestObject,
          request_timestamp: formattedRequestTimestamp,
          api_key: apiKey,
          environment,
        },
      ])
      .select("id") //  Important: Retrieve the generated request ID
      .single();

    if (requestError) {
      console.error("Error inserting API request:", requestError);
      return; //  Or throw an error if you want to halt execution
    }

    const apiRequestId = requestData.id;

    // 2. Insert the response, linking it to the request
    const { error: responseError } = await supabase.from("responses").insert([
      {
        request_id: apiRequestId,
        response_payload: responsePayload,
        response_timestamp: formattedResponseTimestamp,
        response_status: responseStatus,
        environment,
      },
    ]);

    // 3. If folioCodi exists in the response, save it to folios_codi
    const folioCodi = responsePayload?.folioCodi;
    if (folioCodi) {
      const { error: folioCodiError } = await supabase
        .from("folios_codi")
        .insert([
          {
            created_at: formattedResponseTimestamp,
            folio_codi: folioCodi,
            api_key: apiKey,
          },
        ]);
      if (folioCodiError) {
        console.error("Error inserting folioCodi:", folioCodiError);
      }
    }

    // 4. If cadenaMC exists in the response, extract IDC and save as folio_codi
    if (responsePayload?.cadenaMC) {
      try {
        const cadenaMCObj = JSON.parse(responsePayload.cadenaMC);
        const IDC = cadenaMCObj?.ic?.IDC;
        if (IDC) {
          const { error: idcInsertError } = await supabase
            .from("folios_codi")
            .insert([
              {
                created_at: formattedResponseTimestamp,
                folio_codi: IDC,
                api_key: apiKey,
              },
            ]);
          if (idcInsertError) {
            console.error("Error inserting IDC as folio_codi:", idcInsertError);
          }
        }
      } catch (err) {
        console.error("Error parsing cadenaMC or inserting IDC:", err);
      }
    }

    if (responseError) {
      console.error("Error inserting API response:", responseError);
    } else {
      console.log("API request and response logged successfully.");
    }
  } catch (error) {
    console.error("Error logging API data:", error);
  }
}

module.exports = { insertRequestResponse };
