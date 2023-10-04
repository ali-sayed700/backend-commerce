const jwt = require("jsonwebtoken");

const createToken = (value) =>
  jwt.sign({ userId: value }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;
