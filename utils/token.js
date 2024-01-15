const Jwt = require("jsonwebtoken");

function generateToken(id, username, role) {
  return Jwt.sign(
    { id: id, username: username, role: role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
}
module.exports = generateToken;
