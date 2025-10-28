const {
  consultaValidationRules,
} = require("../validators/consultaValidationRules");
const { validationResult } = require("express-validator");

describe("consultaValidationRules direct tests", () => {
  // Helper function to run validation on request body
  async function runValidation(body) {
    const req = { body };
    // Run each validation rule against the request
    for (const rule of consultaValidationRules) {
      await rule.run(req);
    }
    return validationResult(req);
  }

  // VALID DATA TEST
  test("valid data passes validation", async () => {
    const result = await runValidation({
      folioCodi: "1234567890",
      tpg: "50",
      npg: "100",
      fechaInicial: "20230101",
      fechaFinal: "20230201",
    });
    expect(result.isEmpty()).toBe(true);
  });

  // FOLIO CODI TESTS
  describe("folioCodi validation", () => {
    test("should pass with 10 character string", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should pass with 20 character string", async () => {
      const result = await runValidation({
        folioCodi: "12345678901234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should fail with empty string", async () => {
      const result = await runValidation({
        folioCodi: "",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg === "FolioCodi is required")).toBe(true);
    });

    test("should fail with incorrect length", async () => {
      const result = await runValidation({
        folioCodi: "12345",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some(
          (e) => e.msg === "FolioCodi must be 10 or 20 characters long"
        )
      ).toBe(true);
    });
  });

  // TPG TESTS
  describe("tpg validation", () => {
    test("should pass with valid number", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should fail with number out of range", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "101",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some((e) => e.msg === "tpg must be a number between 1 and 100")
      ).toBe(true);
    });

    test("should fail with non-numeric value", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "abc",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg.includes("tpg"))).toBe(true);
    });

    test("should fail when tpg is empty", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg === "tpg is required")).toBe(true);
    });
  });

  // NPG TESTS
  describe("npg validation", () => {
    test("should pass with valid number", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should fail with number out of range", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "0",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some(
          (e) => e.msg === "npg must be a number between 1 and 2147483647"
        )
      ).toBe(true);
    });

    test("should fail when npg is empty", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg === "npg is required")).toBe(true);
    });
  });

  // FECHA INICIAL TESTS
  describe("fechaInicial validation", () => {
    test("should pass with valid date", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should pass with zero value", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "0",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should pass when both fechaInicial and fechaFinal are zero", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "0",
        fechaFinal: "0",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should fail with invalid date format", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "2023/01/01",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg.includes("fechaInicial"))).toBe(true);
    });

    test("should fail with invalid date", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20231301", // Invalid month
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some(
          (e) =>
            e.msg === "fechaInicial must be '0' or a valid date in YYYYMMDD format"
        )
      ).toBe(true);
    });

    test("should fail when fechaInicial is empty", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg === "fechaInicial is required")).toBe(
        true
      );
    });
  });

  // FECHA FINAL TESTS
  describe("fechaFinal validation", () => {
    test("should pass with valid date", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "20230201",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should pass with zero value", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "0",
      });
      expect(result.isEmpty()).toBe(true);
    });

    test("should fail with date before fechaInicial", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230201",
        fechaFinal: "20230101",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some(
          (e) =>
            e.msg ===
            "fechaFinal must be after fechaInicial and not in the future"
        )
      ).toBe(true);
    });

    test("should fail with future date", async () => {
      // Get a date 1 year in the future
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: futureDateStr,
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some(
          (e) =>
            e.msg ===
            "fechaFinal must be after fechaInicial and not in the future"
        )
      ).toBe(true);
    });

    test("should fail when fechaFinal is empty", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "",
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg === "fechaFinal is required")).toBe(true);
    });

    test("should fail with invalid format for fechaFinal", async () => {
      const result = await runValidation({
        folioCodi: "1234567890",
        tpg: "50",
        npg: "100",
        fechaInicial: "20230101",
        fechaFinal: "2023-02-01", // Invalid format
      });
      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some(
          (e) =>
            e.msg ===
            "fechaFinal must be '0' or a valid date in YYYYMMDD format"
        )
      ).toBe(true);
    });
  });
});
