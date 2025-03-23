const {
  checkResultadoMensajeDeCobro,
} = require("../controllers/utils/checkResultadoMensajeCobro");

describe("checkResultadoMensajeDeCobro", () => {
  it("should return undefined for valid resultadoMensajeCobro", () => {
    const resultado = { cadenaInformacion: { resultadoMensajeCobro: 1 } };
    const result = checkResultadoMensajeDeCobro(resultado);
    expect(result).toBeUndefined();
  });

  it("should return -6 for invalid resultadoMensajeCobro", () => {
    const resultado = { cadenaInformacion: { resultadoMensajeCobro: 99 } };
    const result = checkResultadoMensajeDeCobro(resultado);
    expect(result).toBe(-6);
  });

  it("should return -6 when cadenaInformacion is missing", () => {
    const resultado = {};
    const result = checkResultadoMensajeDeCobro(resultado);
    expect(result).toBe(-6);
  });

  it("should return -6 when resultadoMensajeCobro is missing", () => {
    const resultado = { cadenaInformacion: {} };
    const result = checkResultadoMensajeDeCobro(resultado);
    expect(result).toBe(-6);
  });
});
