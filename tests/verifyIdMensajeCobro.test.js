const {
  verifyIdMensajeCobro,
} = require("../controllers/utils/verifyIdMensajeCobro");

test("should return -7 when idMensajeCobro is not a string", () => {
  const resultado = { cadenaInformacion: { idMensajeCobro: 12345 } };
  expect(verifyIdMensajeCobro(resultado)).toBe(-7);
});

test("should return -7 when idMensajeCobro length is not 10 or 20", () => {
  const resultado = { cadenaInformacion: { idMensajeCobro: "123456789" } };
  expect(verifyIdMensajeCobro(resultado)).toBe(-7);
});

test("should return 0 when idMensajeCobro is a valid string of length 10", () => {
  const resultado = { cadenaInformacion: { idMensajeCobro: "1234567890" } };
  expect(verifyIdMensajeCobro(resultado)).toBe(0);
});

test("should return 0 when idMensajeCobro is a valid string of length 20", () => {
  const resultado = {
    cadenaInformacion: { idMensajeCobro: "12345678901234567890" },
  };
  expect(verifyIdMensajeCobro(resultado)).toBe(0);
});
