const { verifyParameters } = require("../controllers/utils/verifyParameters");

describe("verifyParameters", () => {
  it("should return 0 when all required fields and sub-fields are present", () => {
    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: "value",
        celularCliente: "value",
        digitoVerificadorCliente: "value",
        nombreCliente: "value",
        claveInstitucionCliente: "value",
        tipoCuentaCliente: "value",
        numeroCuentaCliente: "value",
        idMensajeCobro: "value",
        concepto: "value",
        monto: "value",
        claveRastreo: "value",
        resultadoMensajeCobro: "value",
        horaSolicitudMensajeCobro: "value",
        horaProcMensajeCobro: "value",
        certBdeM: "value",
        horaEnvioMensaje: "value",
      },
      selloDigital: "value",
    };

    expect(verifyParameters(resultado)).toBe(0);
  });

  it("should return -6 when a required top-level field is missing", () => {
    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: "value",
        celularCliente: "value",
        digitoVerificadorCliente: "value",
        nombreCliente: "value",
        claveInstitucionCliente: "value",
        tipoCuentaCliente: "value",
        numeroCuentaCliente: "value",
        idMensajeCobro: "value",
        concepto: "value",
        monto: "value",
        claveRastreo: "value",
        resultadoMensajeCobro: "value",
        horaSolicitudMensajeCobro: "value",
        horaProcMensajeCobro: "value",
        certBdeM: "value",
        horaEnvioMensaje: "value",
      },
    };

    expect(verifyParameters(resultado)).toBe(-6);
  });

  it("should return -6 when a required sub-field in cadenaInformacion is missing", () => {
    const resultado = {
      cadenaInformacion: {
        certComercioProveedor: "value",
        celularCliente: "value",
        digitoVerificadorCliente: "value",
        nombreCliente: "value",
        claveInstitucionCliente: "value",
        tipoCuentaCliente: "value",
        numeroCuentaCliente: "value",
        idMensajeCobro: "value",
        concepto: "value",
        monto: "value",
        claveRastreo: "value",
        resultadoMensajeCobro: "value",
        horaSolicitudMensajeCobro: "value",
        horaProcMensajeCobro: "value",
        certBdeM: "value",
      },
      selloDigital: "value",
    };

    expect(verifyParameters(resultado)).toBe(-6);
  });

  it("should return -6 when cadenaInformacion is not an object", () => {
    const resultado = {
      cadenaInformacion: "notAnObject",
      selloDigital: "value",
    };

    expect(verifyParameters(resultado)).toBe(-6);
  });

  it("should return -6 when resultado is not an object", () => {
    const resultado = "notAnObject";

    expect(verifyParameters(resultado)).toBe(-6);
  });
});
