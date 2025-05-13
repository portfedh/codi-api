const { extractIdMensajeCobro } = require("../controllers/utils/extractIdMensajeCobro");

// Mock console methods
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

describe("extractIdMensajeCobro", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should extract idMensajeCobro from request body", () => {
    const requestBody = {
      cadenaInformacion: {
        idMensajeCobro: "TEST123456789"
      }
    };

    const result = extractIdMensajeCobro(requestBody);

    expect(result).toBe("TEST123456789");
    expect(consoleLogSpy).toHaveBeenCalledWith("Extracted idMensajeCobro: TEST123456789");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should return null if idMensajeCobro is not found", () => {
    const requestBody = {
      cadenaInformacion: {}
    };

    const result = extractIdMensajeCobro(requestBody);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: idMensajeCobro not found in request body");
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("should handle error if cadenaInformacion is undefined", () => {
    const requestBody = {};

    const result = extractIdMensajeCobro(requestBody);

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error extracting idMensajeCobro:", 
      expect.any(String)
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
