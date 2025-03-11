const { compareCrtBanxico } = require("../controllers/utils/compareCrtBanxico");

describe("compareCrtBanxico", () => {
  test("should return true when crtBanxico matches data.crtBdeM", () => {
    const crtBanxico = "00000100000100015974";
    const data = {
      crtBdeM: "00000100000100015974",
    };
    expect(compareCrtBanxico(crtBanxico, data)).toBe(true);
  });

  test("should return false and log error when crtBanxico does not match data.crtBdeM", () => {
    const crtBanxico = "00000100000100015974";
    const data = {
      crtBdeM: "00000100000100015975",
    };
    console.error = jest.fn(); // Mock console.error
    expect(compareCrtBanxico(crtBanxico, data)).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Mismatch: data.crtBdeM does not match with crtBanxico public key"
    );
  });
});
