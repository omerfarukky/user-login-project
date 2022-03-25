const CryptoJs = require("crypto-js");
const JWT = require("jsonwebtoken");

const passwordToHash = (password) => {
  return CryptoJs.HmacSHA256(
    password,
    CryptoJs.HmacSHA1(password, process.env.PASSWORD_HASH).toString()
  ).toString();
};

const generateActivationToken = (user) => {
  return JWT.sign(
    { email: user.email, ...user },
    process.env.ACTIVATION_TOKEN_SECRET_KEY
  );
};

const verifyToken = (token) => {
  return JWT.verify(token, process.env.ACTIVATION_TOKEN_SECRET_KEY);
};

module.exports = {
  passwordToHash,
  generateActivationToken,
  verifyToken,
};
