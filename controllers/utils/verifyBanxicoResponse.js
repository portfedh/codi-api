function verifyBanxicoResponse(response) {
  const { edoPet, detalleEdoPet = null } = response.data;

  if (edoPet !== 0) {
    return {
      success: false,
      error: "Transaction failed",
      errorCode: edoPet,
      errorDetails: detalleEdoPet,
    };
  }

  return { success: true };
}

module.exports = { verifyBanxicoResponse };
