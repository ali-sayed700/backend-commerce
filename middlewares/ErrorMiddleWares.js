const ApiError = require("../utility/ApiError");

const handleJwtInvalid = () =>
  new ApiError("invalid token , please login again", 401);
const handleJwtExpired = () =>
  new ApiError("Expired token , please login again", 401);

const GlobalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-use-before-define
    SendErrFrDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalid();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    // eslint-disable-next-line no-use-before-define
    SendErrFrPro(err, res);
  }
};

module.exports = GlobalError;

const SendErrFrDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });

const SendErrFrPro = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
