/**
 * ResultadoOperaciones Controller
 *
 * This controller processes and validates operation results from Banxico's CoDi payment system.
 * It verifies signatures, validates request parameters, and ensures data integrity before
 * providing a response with the appropriate status code.
 *
 * @module controllers/resultadoOperaciones
 */

// Imports
// *******
const moment = require("moment-timezone");
const { verifyDigit } = require("./utils/verifyDigit");
const { verifyCellPhone } = require("./utils/verifyCellPhone");
const { verifySignature } = require("./utils/verifySignature");
const { verifyCrtBanxico } = require("./utils/verifyCrtBanxico");
const { verifyTimeStamps } = require("./utils/verifyTimeStamps");
const { verifyClientName } = require("./utils/verifyClientName");
const { verifyParameters } = require("./utils/verifyParameters");
const { verifyAccountType } = require("./utils/verifyAccountType");
const { verifyMensajeCobro } = require("./utils/verifyMensajeCobro");
const { verifyCrtDeveloper } = require("./utils/verifyCrtDeveloper");
const { verifyIdMensajeCobro } = require("./utils/verifyIdMensajeCobro");
const { verifyInstitutionCode } = require("./utils/verifyInstitutionCode");
const { getBanxicoCredentials } = require("./utils/getBanxicoCredentials");
const { insertRequestResponse } = require("./utils/insertRequestResponse");
const {
  verifyResultadoMensajeDeCobro,
} = require("./utils/verifyResultadoMensajeCobro");
const axios = require("axios"); // Add axios for HTTP requests
const supabase = require("../config/supabase"); // Import supabase client

module.exports = {
  /**
   * Handles and validates operation results from payment requests
   *
   * This controller function processes operation results by:
   * 1. Verifying the digital signature using Banxico's public key
   * 2. Running a series of validation checks on the request data
   * 3. Returning appropriate status codes based on validation results
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing operation result data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with resultado status code
   *                   0 if successful, negative values for specific errors
   */
  resultadoOperaciones: async (req, res) => {
    // console.log("Request body: ", req.body);

    //  Capture request timestamp in Mexico City time
    const requestTimestamp = moment().tz("America/Mexico_City");
    let responsePayload = { resultado: 0 }; // Default success response

    try {
      const resultado = req.body;

      const checks = [
        verifyParameters, // Check All fields and sub-fields present
        verifyCellPhone, // Check celularCliente is a 10-digit number in a string
        verifyDigit, // Check digitoVerificadorCliente is a number of 1-9 digits
        verifyClientName, //Check client name is an alphanumeric character up to 40 characters long
        verifyInstitutionCode, // Check its a 3-digit number in a string and in the list of valid institutions
        verifyAccountType, // Check tipoCuentaCliente is a valid number
        verifyCrtDeveloper, // Compare certComercioProveedor with crtOper (Developer) in env file
        verifyCrtBanxico, // Compare certBdeM with crtBanxico in env file
        verifyResultadoMensajeDeCobro, // Check resultadoMensajeCobro is a valid response number
        verifyIdMensajeCobro, // Check idMensajeCobro is a string of 10 or 20 characters
        verifyMensajeCobro, // Check concepto is a string of at least 1 character
        verifyTimeStamps, // Check all timestamps are valid and in order
      ];

      for (let i = 0; i < checks.length; i++) {
        const checkResult = checks[i](resultado);
        if (checkResult !== 0) {
          console.log(
            `Check ${checks[i].name} failed with result ${checkResult}`
          );
          responsePayload = { resultado: checkResult };
          break;
        }
      }

      if (responsePayload.resultado === 0) {
        // Perform signature verification as the last step
        const { publicKeyBanxico } = getBanxicoCredentials();
        const isVerified = verifySignature(resultado, publicKeyBanxico);

        if (!isVerified) {
          console.log("Signature verification failed. Resultado -8");
          responsePayload = { resultado: -8 };
        } else {
          console.log("All checks passed. Processing request.... Resultado 0");
        }
      }

      //  Capture response timestamp in Mexico City time
      const responseTimestamp = moment().tz("America/Mexico_City");

      // Send response immediately
      res.status(200).json(responsePayload);

      // Log the request and response asynchronously
      try {
        await insertRequestResponse({
          route: "/v2/resultadoOperaciones",
          requestHeaders: req.headers,
          requestPayload: req.body,
          requestTimestamp: requestTimestamp,
          responsePayload: responsePayload,
          responseStatus: 200,
          responseTimestamp: responseTimestamp,
        });
      } catch (logError) {
        console.error("Error logging request/response:", logError);
      }

      // Forward to customer callback_url if possible
      await forwardToCallbackUrl(resultado);

    } catch (error) {
      console.error("Error in resultadoOperaciones:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        response: error.response?.data,
      });

      const errorResponse = {
        resultado: -1,
        error: "Error processing operation results",
        details: error.message,
      };

      // Send error response immediately
      res.status(500).json(errorResponse);

      // Log the error asynchronously
      try {
        await insertRequestResponse({
          route: "/v2/resultadoOperaciones",
          requestHeaders: req.headers,
          requestPayload: req.body,
          requestTimestamp: requestTimestamp,
          responsePayload: errorResponse,
          responseStatus: 500,
          responseTimestamp: moment().tz("America/Mexico_City"),
        });
      } catch (logError) {
        console.error("Error logging error response:", logError);
      }
    }
  },
};

// Helper functions below.

/**
 * Forwards the operation result to the customer's callback URL if available
 * 
 * @param {Object} resultado - The operation result payload
 * @returns {Promise<void>}
 */
async function forwardToCallbackUrl(resultado) {
  try {
    const idMensajeCobro = resultado?.cadenaInformacion?.idMensajeCobro;
    if (!idMensajeCobro) return;

    const apiKey = await getApiKeyFromRequest(idMensajeCobro);
    if (!apiKey) return;

    const customerId = await getCustomerIdFromApiKey(apiKey);
    if (!customerId) return;

    const callbackUrl = await getCallbackUrlFromCustomer(customerId);
    if (!callbackUrl) return;

    await forwardPayloadToCallbackUrl(callbackUrl, resultado);
  } catch (forwardError) {
    console.error("Error in callback_url forwarding logic:", forwardError);
  }
}

/**
 * Retrieves the API key associated with a request using idMensajeCobro
 * 
 * @param {string} idMensajeCobro - The message ID to look up
 * @returns {Promise<string|null>} The API key if found, null otherwise
 */
async function getApiKeyFromRequest(idMensajeCobro) {
  // Query the 'requests' table to find the original request
  // We're looking for a request where the idMensajeCobro matches in the request_payload JSON
  const { data: requestRows, error: reqErr } = await supabase
    .from("requests")
    .select("api_key")  // We only need the api_key field
    .eq("request_payload->idMensajeCobro", idMensajeCobro)  // Match the idMensajeCobro in the JSON payload
    .limit(1);  // We only need one result

  if (reqErr) throw reqErr;
  return requestRows?.[0]?.api_key || null;
}

/**
 * Retrieves the customer ID associated with an API key
 * 
 * @param {string} apiKey - The API key to look up
 * @returns {Promise<string|null>} The customer ID if found, null otherwise
 */
async function getCustomerIdFromApiKey(apiKey) {
  // Query the 'api_keys' table to find the active API key
  // We need to verify that the API key exists and is active
  const { data: apiKeyRows, error: apiKeyErr } = await supabase
    .from("api_keys")
    .select("customer_id")  // We only need the customer_id field
    .eq("api_key", apiKey)  // Match the exact API key
    .eq("active", true)     // Ensure the API key is active
    .limit(1);  // We only need one result

  if (apiKeyErr) throw apiKeyErr;
  return apiKeyRows?.[0]?.customer_id || null;
}

/**
 * Retrieves the callback URL for a customer
 * 
 * @param {string} customerId - The customer ID to look up
 * @returns {Promise<string|null>} The callback URL if found, null otherwise
 */
async function getCallbackUrlFromCustomer(customerId) {
  // Query the 'customers' table to find the customer's callback URL
  // We need to get the callback URL where the customer can receive updates
  const { data: customerRows, error: custErr } = await supabase
    .from("customers")
    .select("callback_url")  // We only need the callback_url field
    .eq("id", customerId)    // Match the customer ID
    .limit(1);  // We only need one result

  if (custErr) throw custErr;
  return customerRows?.[0]?.callback_url || null;
}

/**
 * Forwards the payload to the customer's callback URL
 * 
 * @param {string} callbackUrl - The URL to forward the payload to
 * @param {Object} payload - The payload to forward
 * @returns {Promise<void>}
 */
async function forwardPayloadToCallbackUrl(callbackUrl, payload) {
  try {
    await axios.post(callbackUrl, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
    console.log(`Forwarded resultadoOperaciones to callback_url: ${callbackUrl}`);
  } catch (cbErr) {
    console.error("Error forwarding to callback_url:", cbErr);
    throw cbErr;
  }
}
