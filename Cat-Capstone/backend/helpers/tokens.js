const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  if (!user) {
    throw new Error("createToken called without a valid user object");
  }

  let payload = {
    username: user.username,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
