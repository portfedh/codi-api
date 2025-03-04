const {
  generateSignature,
} = require("../controllers/utils/generateDigitalSignature");
const { signData } = require("../controllers/utils/signData");
const { cleanJsonObject } = require("../controllers/utils/cleanJsonObject");
const { hasPipeCharacter } = require("../controllers/utils/hasPipeCharacter");

jest.mock("../controllers/utils/signData");
jest.mock("../controllers/utils/cleanJsonObject");
jest.mock("../controllers/utils/hasPipeCharacter");

describe("generateSignature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a digital signature for valid data", async () => {
    const inputData = { key: "value" };
    const cleanedData = { cleanedKey: "cleanedValue" };
    const stringifiedData = JSON.stringify(cleanedData);
    const expectedSignature = "signature";

    hasPipeCharacter.mockReturnValue(false);
    cleanJsonObject.mockReturnValue(cleanedData);
    signData.mockReturnValue(expectedSignature);

    const signature = await generateSignature(inputData);

    expect(hasPipeCharacter).toHaveBeenCalledWith(inputData);
    expect(cleanJsonObject).toHaveBeenCalledWith(inputData);
    expect(signData).toHaveBeenCalledWith(
      expect.stringContaining(stringifiedData)
    );
    expect(signature).toBe(expectedSignature);
  });

  it("should throw an error if data contains pipe character", async () => {
    const inputData = { key: "value|withPipe" };

    hasPipeCharacter.mockReturnValue(true);

    await expect(generateSignature(inputData)).rejects.toThrow(
      "Datos contienen el símbolo de | concatenar"
    );

    expect(hasPipeCharacter).toHaveBeenCalledWith(inputData);
    expect(cleanJsonObject).not.toHaveBeenCalled();
    expect(signData).not.toHaveBeenCalled();
  });

  it("should throw an error if signData throws an error", async () => {
    const inputData = { key: "value" };
    const cleanedData = { cleanedKey: "cleanedValue" };
    const stringifiedData = JSON.stringify(cleanedData);

    hasPipeCharacter.mockReturnValue(false);
    cleanJsonObject.mockReturnValue(cleanedData);
    signData.mockImplementation(() => {
      throw new Error("Signing error");
    });

    await expect(generateSignature(inputData)).rejects.toThrow("Signing error");

    expect(hasPipeCharacter).toHaveBeenCalledWith(inputData);
    expect(cleanJsonObject).toHaveBeenCalledWith(inputData);
    expect(signData).toHaveBeenCalledWith(
      expect.stringContaining(stringifiedData)
    );
  });
});
