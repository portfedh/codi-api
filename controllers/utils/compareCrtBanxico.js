function compareCrtBanxico(crtBanxico, data) {
  if (crtBanxico === data.crtBdeM) {
    return true;
  } else {
    console.error(
      "Mismatch: data.crtBdeM does not match with crtBanxico public key"
    );
    return false;
  }
}

module.exports = {
  compareCrtBanxico,
};
