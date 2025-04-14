const formatMonto = require("../controllers/utils/formatMonto");

describe("formatMonto", () => {
  it('should return the same string if "monto" already has a decimal part', () => {
    const input = '{"monto": 123.45}';
    const result = formatMonto(input);
    expect(result).toBe(input);
  });

  it('should add ".0" to "monto" if it is an integer', () => {
    const input = '{"monto": 123}';
    const expected = '{"monto":123.0}';
    const result = formatMonto(input);
    expect(result).toBe(expected);
  });

  it('should handle multiple "monto" fields correctly', () => {
    const input = '{"monto": 123, "other": 456, "monto": 789}';
    const expected = '{"monto":123.0, "other": 456, "monto":789.0}';
    const result = formatMonto(input);
    expect(result).toBe(expected);
  });

  it("should not modify unrelated fields", () => {
    const input = '{"value": 123, "monto": 456}';
    const expected = '{"value": 123, "monto":456.0}';
    const result = formatMonto(input);
    expect(result).toBe(expected);
  });

  it('should handle "monto" as the last field in the object', () => {
    const input = '{"key": "value", "monto": 123}';
    const expected = '{"key": "value", "monto":123.0}';
    const result = formatMonto(input);
    expect(result).toBe(expected);
  });

  it("should handle empty JSON objects gracefully", () => {
    const input = "{}";
    const result = formatMonto(input);
    expect(result).toBe(input);
  });

  it("should handle invalid JSON strings gracefully", () => {
    const input = "invalid json";
    expect(() => formatMonto(input)).not.toThrow();
    expect(formatMonto(input)).toBe(input);
  });
});
