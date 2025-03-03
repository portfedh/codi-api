function hasPipeCharacter(data) {
  // 1. Get all values from the object and convert them to an array
  const values = Object.values(data);
  // 2. Loop through each value in the array
  for (let i = 0; i < values.length; i++) {
    // 3. Convert the current value to a string
    const currentValue = String(values[i]);
    // 4. Check if the string contains a pipe character
    if (currentValue.includes("|")) {
      return true;
    }
  }
  // 5. If no pipe character was found, return false
  return false;
}

module.exports = {
  hasPipeCharacter,
};

