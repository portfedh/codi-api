const assert = require("assert");
const generateApiKey = require("../controllers/utils/generateApiKey");

describe("generateApiKey", () => {
  it("should generate a string", () => {
    const apiKey = generateApiKey();
    assert.strictEqual(typeof apiKey, "string");
  });

  it("should generate a string of 128 characters", () => {
    const apiKey = generateApiKey();
    assert.strictEqual(apiKey.length, 128);
  });

  it("should generate a valid hexadecimal string", () => {
    const apiKey = generateApiKey();
    const hexRegex = /^[a-f0-9]+$/i;
    assert.strictEqual(hexRegex.test(apiKey), true);
  });

  it("should generate unique keys on multiple calls", () => {
    const apiKey1 = generateApiKey();
    const apiKey2 = generateApiKey();
    assert.notStrictEqual(apiKey1, apiKey2);
  });
});
