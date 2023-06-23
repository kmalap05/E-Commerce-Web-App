const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  if (!err.message) {
    err.message = "Internal Server Error!";
  }

  if (err.name === "CastError") {
    const error = new ErrorHandler(
      `Resource Not Found. Invalid: ${err.path}`,
      400
    );

    err = error;
  }

  if (err.code === 11000) {
    const error = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)}`,
      400
    );

    err = error;
  }

  if (err.name === "JsonWebTokenError") {
    const error = new ErrorHandler(
      `JSON Web Token Is Invalid, Please Try Again!`,
      400
    );

    err = error;
  }

  if (err.name === "TokenExpiredError") {
    const error = new ErrorHandler(
      `JSON Web Token Is Expired, Please Try Again!`,
      400
    );

    err = error;
  }

  res.status(err.statusCode);

  res.json({
    success: false,
    message: err.message,
  });

  // next();
};
