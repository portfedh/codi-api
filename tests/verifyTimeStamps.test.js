const { verifyTimeStamps } = require("../controllers/utils/verifyTimeStamps");

describe("verifyTimeStamps", () => {
  it("should return 0 when timestamps are in correct order", () => {
    const resultado = {
      cadenaInformacion: {
        horaSolicitudMensajeCobro: 1742697722821,
        horaProcMensajeCobro: 1742697778432,
        horaEnvioMensaje: 1742697778540,
      },
    };
    expect(verifyTimeStamps(resultado)).toBe(0);
  });

  it("should return -10 when horaSolicitudMensajeCobro is not before horaProcMensajeCobro", () => {
    const resultado = {
      cadenaInformacion: {
        horaSolicitudMensajeCobro: 1742697778432,
        horaProcMensajeCobro: 1742697722821,
        horaEnvioMensaje: 1742697778540,
      },
    };
    expect(verifyTimeStamps(resultado)).toBe(-10);
  });

  it("should return -10 when horaProcMensajeCobro is not before horaEnvioMensaje", () => {
    const resultado = {
      cadenaInformacion: {
        horaSolicitudMensajeCobro: 1742697722821,
        horaProcMensajeCobro: 1742697778540,
        horaEnvioMensaje: 1742697778432,
      },
    };
    expect(verifyTimeStamps(resultado)).toBe(-10);
  });

  it("should return -10 when any timestamp is missing or undefined", () => {
    const resultado = {
      cadenaInformacion: {
        horaSolicitudMensajeCobro: 1742697722821,
        horaProcMensajeCobro: undefined,
        horaEnvioMensaje: 1742697778540,
      },
    };
    expect(verifyTimeStamps(resultado)).toBe(-10);
  });
});
