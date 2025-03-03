const { toValidUTF8 } = require("./toValidUTF8");

// Cuidar caso: Envío de concepto un numero: 200. Debe ser string.
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
