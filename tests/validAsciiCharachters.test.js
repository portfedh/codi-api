const validAsciiCharacters = require("../config/validAsciiCharacters");

describe("validAsciiCharacters", () => {
  it("should contain valid mappings for common ASCII characters", () => {
    expect(validAsciiCharacters[32]).toBe(" ");
    expect(validAsciiCharacters[33]).toBe("!");
    expect(validAsciiCharacters[65]).toBe("A");
    expect(validAsciiCharacters[97]).toBe("a");
  });

  it("should contain valid mappings for accented characters", () => {
    expect(validAsciiCharacters[130]).toBe("é");
    expect(validAsciiCharacters[160]).toBe("á");
    expect(validAsciiCharacters[161]).toBe("í");
    expect(validAsciiCharacters[162]).toBe("ó");
    expect(validAsciiCharacters[163]).toBe("ú");
  });

  it("should contain valid mappings for special Spanish characters", () => {
    expect(validAsciiCharacters[164]).toBe("ñ");
    expect(validAsciiCharacters[165]).toBe("Ñ");
    expect(validAsciiCharacters[168]).toBe("¿");
    expect(validAsciiCharacters[173]).toBe("¡");
  });

  it("should not contain undefined mappings for invalid keys", () => {
    expect(validAsciiCharacters[999]).toBeUndefined();
    expect(validAsciiCharacters[-1]).toBeUndefined();
  });
});
