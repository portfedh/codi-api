/**
 * @fileoverview Utility functions for cleaning and normalizing JSON data.
 * Contains functions to ensure data integrity when processing JSON objects.
 */

const { toValidUTF8 } = require("./toValidUTF8");

/**
 * Cleans and normalizes a JSON object by recursively processing all properties.
 *
 * @param {*} data - The data to clean. Can be any JSON-compatible value.
 * @returns {*} The cleaned data with the same structure but normalized strings.
 *
 * @example
 * // Returns cleaned object with normalized strings
 * cleanJsonObject({ name: "John\n\t", age: 30 });
 *
 * @example
 * // Note: When numeric values need to be sent as strings (e.g., "200" instead of 200),
 * // they should be explicitly converted to strings before calling this function.
 */
function cleanJsonObject(data) {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "object") {
    // If data is an object, iterate through its properties
    for (const key in data) {
      if (Object.hasOwn(data, key)) {
        data[key] = cleanJsonObject(data[key]); // Recursively clean nested objects
      }
    }
  } else if (typeof data === "string") {
    // Ensure the string is valid UTF-8
    data = toValidUTF8(data);
    // Remove line breaks, tabs, and trim spaces
    data = data.replace(/[\n\r\t]/g, "").trim();
  }

  return data;
}

module.exports = {
  cleanJsonObject,
};
