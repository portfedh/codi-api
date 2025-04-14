const { expect } = require("chai");
const generateApiKey = require("../controllers/utils/generate_api_key");

describe("generateApiKey", () => {
  it("should generate a string", () => {
    const apiKey = generateApiKey();
    expect(apiKey).to.be.a("string");
  });

  it("should generate a string of 128 characters", () => {
    const apiKey = generateApiKey();
    expect(apiKey.length).to.equal(128);
  });

  it("should generate a valid hexadecimal string", () => {
    const apiKey = generateApiKey();
    const hexRegex = /^[a-f0-9]+$/i;
    expect(hexRegex.test(apiKey)).to.be.true;
  });

  it("should generate unique keys on multiple calls", () => {
    const apiKey1 = generateApiKey();
    const apiKey2 = generateApiKey();
    expect(apiKey1).to.not.equal(apiKey2);
  });
});
