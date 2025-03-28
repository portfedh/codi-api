const { validateRequest } = require("../validators/validateRequest");
const { validationResult } = require("express-validator");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("validateRequest middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if there are no validation errors", () => {
    validationResult.mockReturnValueOnce({ isEmpty: () => true });

    validateRequest(req, res, next);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 and errors if validation errors exist", () => {
    const errorsArray = [{ msg: "Invalid value", param: "field" }];
    validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => errorsArray,
    });

    validateRequest(req, res, next);

    expect(validationResult).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: errorsArray });
    expect(next).not.toHaveBeenCalled();
  });
});
