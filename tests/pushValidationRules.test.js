const { pushValidationRules } = require("../validators/pushValidationRules");
const { validationResult } = require("express-validator");

describe("pushValidationRules direct tests", () => {
  // Helper function to run validation on request body
  async function runValidation(body) {
    const req = { body };
    // Run each validation rule against the request
    for (const rule of pushValidationRules) {
      await rule.run(req);
    }
    return validationResult(req);
  }

  // VALID DATA TEST
  test("valid data passes validation", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(true);
  });

  // CELULAR CLIENTE TESTS
  test("celularCliente cannot be empty", async () => {
    const result = await runValidation({
      celularCliente: "",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e) => e.msg === "celularCliente cannot be empty")).toBe(
      true
    );
  });

  test("celularCliente must have exactly 10 numeric digits", async () => {
    // Too few digits
    let result = await runValidation({
      celularCliente: "123456789",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    let errors = result.array();
    expect(
      errors.some(
        (e) => e.msg === "CelularCliente must contain exactly 10 numeric digits"
      )
    ).toBe(true);

    // Too many digits
    result = await runValidation({
      celularCliente: "12345678901",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    errors = result.array();
    expect(
      errors.some(
        (e) => e.msg === "CelularCliente must contain exactly 10 numeric digits"
      )
    ).toBe(true);

    // Non-numeric characters
    result = await runValidation({
      celularCliente: "123456789a",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    errors = result.array();
    expect(
      errors.some(
        (e) => e.msg === "CelularCliente must contain exactly 10 numeric digits"
      )
    ).toBe(true);
  });

  test("celularCliente accepts numeric value (not string)", async () => {
    const result = await runValidation({
      celularCliente: 5512345678,
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(true);
  });

  // MONTO TESTS
  test("monto cannot be empty", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: "",
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e) => e.msg === "Monto cannot be empty")).toBe(true);
  });

  test("monto must be a numeric value", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: "not-numeric",
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e) => e.msg === "Monto must be a numeric value")).toBe(
      true
    );
  });

  test("monto must be within valid range and have at most 2 decimals", async () => {
    // Too many decimal places
    let result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.635,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    let errors = result.array();
    expect(
      errors.some((e) => e.msg.includes("with at most two decimal places"))
    ).toBe(true);

    // Negative amount
    result = await runValidation({
      celularCliente: "5512345678",
      monto: -10.5,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    errors = result.array();
    expect(
      errors.some((e) => e.msg.includes("between 0 and 999,999,999,999.99"))
    ).toBe(true);

    // Amount too large
    result = await runValidation({
      celularCliente: "5512345678",
      monto: 1000000000000,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    errors = result.array();
    expect(
      errors.some((e) => e.msg.includes("between 0 and 999,999,999,999.99"))
    ).toBe(true);
  });

  // REFERENCIA NUMERICA TESTS
  test("referenciaNumerica sanitization works for empty string", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(true);
  });

  test("referenciaNumerica must be alphanumeric with max 7 characters", async () => {
    // Special characters
    let result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "123!456",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    let errors = result.array();
    expect(
      errors.some((e) =>
        e.msg.includes(
          "ReferenciaNumerica must be a string or number with a maximum length of 7 characters and no special characters"
        )
      )
    ).toBe(true);

    // Too long
    result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "12345678",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    errors = result.array();
    expect(
      errors.some((e) =>
        e.msg.includes(
          "ReferenciaNumerica must be a string or number with a maximum length of 7 characters and no special characters"
        )
      )
    ).toBe(true);
  });

  test("referenciaNumerica accepts numeric value (not string)", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: 1234567,
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(true);
  });

  // CONCEPTO TESTS
  test("concepto must have valid length", async () => {
    // Empty
    let result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    let errors = result.array();
    expect(errors.some((e) => e.msg.includes("minimum length of 1"))).toBe(
      true
    );

    // Too long
    result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "A".repeat(41),
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    errors = result.array();
    expect(errors.some((e) => e.msg.includes("maximum length of 40"))).toBe(
      true
    );
  });

  test("concepto must have valid characters only", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Invalid€Concept", // Euro symbol which is invalid
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(
      errors.some((e) => e.msg === "Concepto contains invalid characters")
    ).toBe(true);
  });

  // VIGENCIA TESTS
  test("vigencia cannot be empty", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "",
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e) => e.msg === "Vigencia cannot be empty")).toBe(true);
  });

  test('vigencia special case "0" is valid', async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "0",
    });
    expect(result.isEmpty()).toBe(true);
  });

  test("vigencia must be numeric", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "123abc",
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(
      errors.some((e) => e.msg.includes("numeric value without any letters"))
    ).toBe(true);
  });

  test("vigencia must not exceed max length", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "1".repeat(16),
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e) => e.msg.includes("cannot exceed 15 digits"))).toBe(
      true
    );
  });

  test("vigencia timestamp must be in the future", async () => {
    const pastTimestamp = new Date(2020, 0, 1).getTime();
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: pastTimestamp.toString(),
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e) => e.msg.includes("must be in the future"))).toBe(
      true
    );
  });

  test("vigencia timestamp must not be too far in the future", async () => {
    const twoYearsFromNow = Date.now() + 2 * 365 * 24 * 60 * 60 * 1000;
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: twoYearsFromNow.toString(),
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e) => e.msg.includes("cannot exceed one year"))).toBe(
      true
    );
  });

  test("vigencia in seconds format is properly normalized", async () => {
    // One day in the future, expressed in seconds
    const oneDayFromNowInSeconds = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: oneDayFromNowInSeconds.toString(),
    });
    expect(result.isEmpty()).toBe(true);
  });

  test("vigencia must be a valid numeric timestamp", async () => {
    const result = await runValidation({
      celularCliente: "5512345678",
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Valid concept",
      vigencia: "invalid-timestamp",
    });
    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(
      errors.some(
        (e) =>
          e.msg ===
          "Vigencia must be '0' or a numeric value without any letters or special characters"
      )
    ).toBe(true);
  });
});
