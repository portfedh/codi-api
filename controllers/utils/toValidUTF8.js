/**
 * Removes non-printable and invalid UTF-8 characters from a string.
 *
 * This function takes a string as input, removes any non-printable characters
 * (Unicode code points between 0 and 31 or between 127 and 159) and invalid UTF-8
 * characters, and returns the resulting string.
 *
 * @param {string} str - The input string.
 * @returns {string} The input string with non-printable and invalid UTF-8 characters removed.
 */
function toValidUTF8(str) {
  // We're using a regular expression to match non-printable characters.
  // The regular expression /[x00-x1Fx7F-x9F]/g matches any character
  // with a Unicode code point between 0 and 31 (x00-x1F) or between 127 and 159 (x7F-x9F).
  // These are the Unicode code points for non-printable characters.
  // The 'g' flag at the end of the regular expression means 'global', so we match all occurrences in the string, not just the first one.
  return str.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
}

module.exports = {
  toValidUTF8,
};
