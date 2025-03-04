const { hasPipeCharacter } = require("../utils/hasPipeCharacter");

describe("hasPipeCharacter", () => {
  test("should return true if any value contains a pipe character", () => {
    const data = { key1: "value1", key2: "value|2", key3: "value3" };
    expect(hasPipeCharacter(data)).toBe(true);
  });

  test("should return false if no value contains a pipe character", () => {
    const data = { key1: "value1", key2: "value2", key3: "value3" };
    expect(hasPipeCharacter(data)).toBe(false);
  });

  test("should return false for an empty object", () => {
    const data = {};
    expect(hasPipeCharacter(data)).toBe(false);
  });

  test("should return true if a value is exactly a pipe character", () => {
    const data = { key1: "|" };
    expect(hasPipeCharacter(data)).toBe(true);
  });

  test("should return false if values are numbers without pipe character", () => {
    const data = { key1: 123, key2: 456, key3: 789 };
    expect(hasPipeCharacter(data)).toBe(false);
  });

  test("should return true if a number value contains a pipe character when converted to string", () => {
    const data = { key1: 123, key2: "45|6", key3: 789 };
    expect(hasPipeCharacter(data)).toBe(true);
  });
});
