const { cleanJsonObject } = require("../utils/cleanJsonObject");

describe("cleanJsonObject", () => {
  it("should return 'null' when input is null", () => {
    const result = cleanJsonObject(null);
    expect(result).toBe(null);
  });

  it("should return 'undefined' when input is undefined", () => {
    const result = cleanJsonObject(undefined);
    expect(result).toBe(undefined);
  });

  it("should handle empty object", () => {
    const input = {};
    const expectedOutput = {};
    const result = cleanJsonObject(input);
    expect(result).toStrictEqual(expectedOutput);
  });

  it("should handle production-like data object", () => {
    const input = {
      datosMC: {
        monto: 0.03,
        referenciaNumerica: "1234567",
        concepto: " concepto\n\t de  prueba ",
        vigencia: 0,
        apiKey: "1e96d3281b23293a",
      },
    };
    const expectedOutput = {
      datosMC: {
        monto: 0.03,
        referenciaNumerica: "1234567",
        concepto: "concepto de  prueba",
        vigencia: 0,
        apiKey: "1e96d3281b23293a",
      },
    };
    const result = cleanJsonObject(input);
    expect(result).toStrictEqual(expectedOutput);
  });
});
