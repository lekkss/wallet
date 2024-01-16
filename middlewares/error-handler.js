const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // Set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  return res.status(customError.statusCode).json({
    statusCode: customError.statusCode,
    status: false,
    message: customError.msg,
  });
};

module.exports = errorHandlerMiddleware;
