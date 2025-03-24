const {
  verifyResultadoMensajeDeCobro,
} = require("../controllers/utils/verifyResultadoMensajeCobro");

test("should return -6 when cadenaInformacion is missing", () => {
  const resultado = {};
  expect(verifyResultadoMensajeDeCobro(resultado)).toBe(-6);
});

test("should return -6 when resultadoMensajeCobro is missing", () => {
  const resultado = { cadenaInformacion: {} };
  expect(verifyResultadoMensajeDeCobro(resultado)).toBe(-6);
});

test("should return -6 when resultado is null", () => {
  const resultado = null;
  expect(verifyResultadoMensajeDeCobro(resultado)).toBe(-6);
});

test("should return -6 when resultado is undefined", () => {
  const resultado = undefined;
  expect(verifyResultadoMensajeDeCobro(resultado)).toBe(-6);
});

test("should return -6 when resultadoMensajeCobro is invalid", () => {
  const resultado = { cadenaInformacion: { resultadoMensajeCobro: 99 } };
  expect(verifyResultadoMensajeDeCobro(resultado)).toBe(-6);
});

test("should return 0 when resultadoMensajeCobro is valid", () => {
  const resultado = { cadenaInformacion: { resultadoMensajeCobro: 0 } };
  expect(verifyResultadoMensajeDeCobro(resultado)).toBe(0);
});

test("should return 0 when resultadoMensajeCobro is another valid value", () => {
  const resultado = { cadenaInformacion: { resultadoMensajeCobro: 1 } };
  expect(verifyResultadoMensajeDeCobro(resultado)).toBe(0);
});
