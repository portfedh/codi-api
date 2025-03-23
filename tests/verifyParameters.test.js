const { verifyParameters } = require("../controllers/utils/verifyParameters");

describe("verifyParameters", () => {
  it("should not throw an error when all required fields and sub-fields are present", () => {
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

    expect(() => verifyParameters(resultado)).not.toThrow();
  });

  it("should throw an error when a required field is missing", () => {
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

    expect(() => verifyParameters(resultado)).toThrow(
      "Missing required field: selloDigital"
    );
  });

  it("should throw an error when a required sub-field is missing", () => {
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

    expect(() => verifyParameters(resultado)).toThrow(
      "Missing required sub-field in cadenaInformacion: horaEnvioMensaje"
    );
  });

  it("should throw an error when cadenaInformacion is not an object", () => {
    const resultado = {
      cadenaInformacion: "notAnObject",
      selloDigital: "value",
    };

    expect(() => verifyParameters(resultado)).toThrow();
  });

  it("should throw an error when resultado is not an object", () => {
    const resultado = "notAnObject";

    expect(() => verifyParameters(resultado)).toThrow();
  });
});
