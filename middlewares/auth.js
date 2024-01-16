const Jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index.js");

const auth =
  (...args) =>
  async (req, res, next) => {
    console.log(args);
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      throw new UnauthenticatedError("Authentication Requied");
    }
    const token = authHeaders.split(" ")[1];
    try {
      const decoded = Jwt.verify(token, process.env.JWT_SECRET);
      const { id, email, role } = decoded;
      if (args.includes(role)) {
        req.user = { id, email, role };
        next();
      } else {
        return res.status(403).json({
          status: StatusCodes.FORBIDDEN,
          message: "Access forbidden",
        });
      }
    } catch (error) {
      throw new UnauthenticatedError("Authentication invalid");
    }
  };

module.exports = auth;
