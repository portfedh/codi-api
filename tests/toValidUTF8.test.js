const { toValidUTF8 } = require("../controllers/utils/toValidUTF8");

describe("toValidUTF8", () => {
  test("should return the same string if it is already valid UTF-8", () => {
    const input = "Hello, world!";
    const output = toValidUTF8(input);
    expect(output).toBe(input);
  });

  test("should handle invalid UTF-8 characters gracefully", () => {
    const input = "Hello, world! \x80\x81\x82";
    const output = toValidUTF8(input);
    expect(output).toBe("Hello, world! ");
  });

  test("should return an empty string if input is an empty string", () => {
    const input = "";
    const output = toValidUTF8(input);
    expect(output).toBe(input);
  });

  test("should handle multi-byte UTF-8 characters", () => {
    const input = "こんにちは";
    const output = toValidUTF8(input);
    expect(output).toBe(input);
  });

  test("should handle mixed valid and invalid UTF-8 characters", () => {
    const input = "Hello, 世界! \x80\x81\x82";
    const output = toValidUTF8(input);
    expect(output).toBe("Hello, 世界! ");
  });
});
