const gb = 1000000000;
const maxFileSize = 0.5 * gb;
const cofig = {
  maxFileSize,
  maxFileSizeStr: (maxFileSize / gb) + "Gb",
  accessTokenExpiration: '1d',
  refreshTokenExpiration: '365d',
  emailTokenExpirationInMs: 1 * 60 * 60 * 1000, //1h
};

module.exports = cofig;