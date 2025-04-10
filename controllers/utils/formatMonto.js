/**
 * Formats the 'monto' value in a stringified JSON object to maintain its original decimal format.
 *
 * @param {string} jsonString - The input stringified JSON object.
 * @returns {string} The modified stringified JSON object with the 'monto' value formatted.
 */
function formatMonto(jsonString) {
  // Check if the monto already has a decimal part
  if (jsonString.match(/"monto"\s*:\s*\d+\.\d+/)) {
    // "monto": Matches the exact string "monto". The double quotes are escaped with \" to ensure they are treated as literal characters.
    // \s*: Matches zero or more whitespace characters (spaces, tabs, etc.) after "monto". This allows flexibility in formatting.
    // :: Matches the colon : that separates the key from the value.
    // \s*: Matches zero or more whitespace characters after the colon.
    // \d+: Matches one or more digits (the integer part of the number).
    // \.: Matches the literal decimal point ..
    // \d+: Matches one or more digits after the decimal point (the fractional part of the number).

    // Already has a decimal part, return as is
    return jsonString;
  }

  // Find monto values that are integers (no decimal) and add ".0" to them
  const formattedString = jsonString.replace(
    /"monto"\s*:\s*(\d+)([,}])/g,
    '"monto":$1.0$2'
  );
  // "monto": Matches the exact string "monto".
  // \s*: Matches zero or more whitespace characters after "monto".
  // :: Matches the colon : that separates the key from the value.
  // \s*: Matches zero or more whitespace characters after the colon.
  // (\d+): Captures one or more digits (the integer value of monto) into a capturing group. This is the value that will be modified.
  // ([,}]): Captures either a comma , (if the monto is followed by another key-value pair) or a closing curly brace } (if monto is the last key in the object). This ensures the regex matches the correct context.
  // Replacement:
  // $1: Refers to the first capturing group (the integer value of monto).
  // .0: Adds .0 to the integer value.
  // $2: Refers to the second capturing group (either , or }).

  console.log(
    "Original JSON string: ",
    jsonString,
    "\nFormatted JSON string: ",
    formattedString
  );

  return formattedString;
}

module.exports = formatMonto;
