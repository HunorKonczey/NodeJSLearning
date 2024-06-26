const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants/const");

const createAccessJWTToken = async (user, payload, issuer) => {
  return await jwt.sign(payload, SECRET_KEY, {
    expiresIn: '100h',
    subject: user.name,
    issuer: issuer,
    algorithm: 'HS256'
  })
}

const createRefreshJWTToken = async (user, payload, issuer) => {
  return await jwt.sign(payload, SECRET_KEY, {
    expiresIn: '10h',
    subject: user.name,
    issuer: issuer,
    algorithm: 'HS256'
  })
}

module.exports = {
  createAccessJWTToken,
  createRefreshJWTToken
}