const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { SECRET_KEY } = require("../constants/const");

dotenv.config()

const authMiddleware = (req, res, next) => {
  // Get token from header
  let token = req.headers.authorization && req.headers.authorization.match(/^Bearer (.*)$/)
  if (token && token[1]) {
    token = token[1];
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY)

    // Add user from payload
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
};

module.exports = authMiddleware