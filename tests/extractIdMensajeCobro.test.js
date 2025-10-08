const { extractIdMensajeCobro } = require("../controllers/utils/extractIdMensajeCobro");

describe("extractIdMensajeCobro", () => {
  it("should extract idMensajeCobro from request body", () => {
    const requestBody = {
      cadenaInformacion: {
        idMensajeCobro: "TEST123456789"
      }
    };

    const result = extractIdMensajeCobro(requestBody);

    expect(result).toBe("TEST123456789");
  });

  it("should return null if idMensajeCobro is not found", () => {
    const requestBody = {
      cadenaInformacion: {}
    };

    const result = extractIdMensajeCobro(requestBody);

    expect(result).toBeNull();
  });

  it("should handle error if cadenaInformacion is undefined", () => {
    const requestBody = {};

    const result = extractIdMensajeCobro(requestBody);

    expect(result).toBeNull();
  });
});
