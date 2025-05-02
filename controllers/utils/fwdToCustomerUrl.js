/**
 * Forwards operation results to customer callback URL
 *
 * This function finds the appropriate customer based on the nombreCliente value,
 * retrieves their callback URL from the database, and forwards the original request
 * along with validation results to that URL.
 *
 * @param {Object} requestBody - The request body containing operation result data
 * @param {number} validationResult - The validation result code
 * @returns {Promise<void>}
 */

const axios = require("axios");
const supabase = require("../../config/supabase");

async function fwdToCustomerUrl(requestBody, validationResult) {
  /*
  // Extract nombreCliente value
  const nombreCliente = requestBody.cadenaInformacion.nombreCliente;

  // Query Supabase customers table for the matching customer
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("callback_url")
    .eq("name_redacted", nombreCliente)
    .single();

  if (customerError) {
    console.error("Error querying customer:", customerError);
  } else if (customerData && customerData.callback_url) {
    // Forward request to callback URL
    try {
      const forwardResponse = await axios.post(
        customerData.callback_url,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Validation-Result": validationResult,
          },
        }
      );
      console.log(
        `Request forwarded to ${customerData.callback_url}, status: ${forwardResponse.status}`
      );
    } catch (forwardError) {
      console.error(
        `Error forwarding request to ${customerData.callback_url}:`,
        {
          message: forwardError.message,
          status: forwardError.response?.status,
          data: forwardError.response?.data,
        }
      );
    }
  } else {
    console.log(`No callback URL found for customer: ${nombreCliente}`);
  }
  */

  // Hardcoded URL for forwarding
  const targetUrl =
    "https://admin.salsa-candela.com/fiesta/boletos/codi/webhook";

  try {
    const forwardResponse = await axios.post(targetUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Validation-Result": validationResult,
      },
    });
    console.log(
      `Request forwarded to ${targetUrl}, status: ${forwardResponse.status}`
    );
  } catch (forwardError) {
    console.error(`Error forwarding request to ${targetUrl}:`, {
      message: forwardError.message,
      status: forwardError.response?.status,
      data: forwardError.response?.data,
    });
  }
}

module.exports = { fwdToCustomerUrl };
