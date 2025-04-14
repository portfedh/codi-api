const {
  verifyBanxicoResponse,
} = require("../controllers/utils/verifyBanxicoResponse");

describe("verifyBanxicoResponse", () => {
  it("should return { success: true } when edoPet is 0", () => {
    const response = {
      data: {
        edoPet: 0,
        detalleEdoPet: [],
      },
    };

    const result = verifyBanxicoResponse(response);
    expect(result).toEqual({ success: true });
  });

  it("should return an error object with details when edoPet is not 0 and detalleEdoPet is provided", () => {
    const response = {
      data: {
        edoPet: -3,
        detalleEdoPet: [-303, -302, -301, -305, -304],
      },
    };

    const result = verifyBanxicoResponse(response);
    expect(result).toEqual({
      success: false,
      error: "Transaction failed",
      errorCode: -3,
      errorDetails: [-303, -302, -301, -305, -304],
    });
  });

  it("should return an error object with null errorDetails when edoPet is not 0 and detalleEdoPet is not provided", () => {
    const response = {
      data: {
        edoPet: -1,
      },
    };

    const result = verifyBanxicoResponse(response);
    expect(result).toEqual({
      success: false,
      error: "Transaction failed",
      errorCode: -1,
      errorDetails: null,
    });
  });
});
