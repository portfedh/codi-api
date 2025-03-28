const { qrValidationRules } = require("../validators/qrValidationRules");
const { validationResult } = require("express-validator");

jest.mock("express-validator", () => ({
  body: jest.fn(() => ({
    isNumeric: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    custom: jest.fn().mockReturnThis(),
    isString: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
  })),
  validationResult: jest.fn(),
}));

describe("qrValidationRules", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should validate a valid request", () => {
    req.body = {
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Boleto: de evento mensual",
      vigencia: 0,
    };

    validationResult.mockReturnValueOnce({ isEmpty: () => true });

    qrValidationRules.forEach((rule) => rule.run(req));
    const errors = validationResult(req);

    expect(errors.isEmpty()).toBe(true);
    expect(next).not.toHaveBeenCalledWith(expect.anything());
  });

  it("should return an error for invalid 'monto'", () => {
    req.body = {
      monto: "invalid",
      referenciaNumerica: "1234567",
      concepto: "Boleto: de evento mensual",
      vigencia: 0,
    };

    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Monto must be a numeric value", param: "monto" }],
    });

    qrValidationRules.forEach((rule) => rule.run(req));
    const errors = validationResult(req);

    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toEqual([
      { msg: "Monto must be a numeric value", param: "monto" },
    ]);
  });

  it("should return an error for invalid 'referenciaNumerica'", () => {
    req.body = {
      monto: 95.63,
      referenciaNumerica: "invalid!",
      concepto: "Boleto: de evento mensual",
      vigencia: 0,
    };

    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [
        {
          msg: "ReferenciaNumerica must be an alphanumeric string or number with a maximum length of 7 characters and no special characters",
          param: "referenciaNumerica",
        },
      ],
    });

    qrValidationRules.forEach((rule) => rule.run(req));
    const errors = validationResult(req);

    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toEqual([
      {
        msg: "ReferenciaNumerica must be an alphanumeric string or number with a maximum length of 7 characters and no special characters",
        param: "referenciaNumerica",
      },
    ]);
  });

  it("should return an error for invalid 'concepto'", () => {
    req.body = {
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Invalid@Concept",
      vigencia: 0,
    };

    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [
        { msg: "Concepto contains invalid characters", param: "concepto" },
      ],
    });

    qrValidationRules.forEach((rule) => rule.run(req));
    const errors = validationResult(req);

    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toEqual([
      { msg: "Concepto contains invalid characters", param: "concepto" },
    ]);
  });

  it("should return an error for invalid 'vigencia'", () => {
    req.body = {
      monto: 95.63,
      referenciaNumerica: "1234567",
      concepto: "Boleto: de evento mensual",
      vigencia: "invalid",
    };

    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [
        {
          msg: "Vigencia must be a number or string, max 15 characters long, that can be a Date.now() value or 0",
          param: "vigencia",
        },
      ],
    });

    qrValidationRules.forEach((rule) => rule.run(req));
    const errors = validationResult(req);

    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toEqual([
      {
        msg: "Vigencia must be a number or string, max 15 characters long, that can be a Date.now() value or 0",
        param: "vigencia",
      },
    ]);
  });
});
