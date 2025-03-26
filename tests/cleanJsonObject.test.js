const { cleanJsonObject } = require("../controllers/utils/cleanJsonObject");

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

  it("should handle objects with inherited properties", () => {
    // Create parent object with a property
    const parentObj = { parentProp: "parent value" };

    // Create child object inheriting from parent
    const childObj = Object.create(parentObj);
    childObj.ownProp = "child value";

    const result = cleanJsonObject(childObj);

    // Should only clean own properties, not inherited ones
    expect(result).toHaveProperty("ownProp");
    expect(result.ownProp).toBe("child value");

    // The inherited property should not be in the result as an own property
    expect(Object.hasOwn(result, "parentProp")).toBe(false);
  });

  it("should handle arrays as objects", () => {
    const input = ["line\nbreak", "tab\tcharacter", " spaces "];
    const expectedOutput = ["linebreak", "tabcharacter", "spaces"];

    const result = cleanJsonObject(input);
    expect(result).toStrictEqual(expectedOutput);
  });

  it("should handle numeric concept values", () => {
    // As per comment: "Cuidar caso: Envío de concepto un numero: 200. Debe ser string."
    const input = {
      datosMC: {
        concepto: 200,
        monto: 100,
      },
    };

    // Numeric values that aren't strings should remain unchanged
    const expectedOutput = {
      datosMC: {
        concepto: 200,
        monto: 100,
      },
    };

    const result = cleanJsonObject(input);
    expect(result).toStrictEqual(expectedOutput);
  });
});
