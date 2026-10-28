
const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  const allowedClientStatusCodes = [400, 401, 403, 404, 409, 422]

  const isOperationalAppError =
    err instanceof AppError &&
    err.isOperational === true &&
    allowedClientStatusCodes.includes(err.statusCode);

  const statusCode = isOperationalAppError
    ? err.statusCode
    : 500;

  if (statusCode === 500) {
    // Log only basic metadata; never send internal details to the client.
    console.error("Server error occurred:", err.name || "Error");
  }

  return res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message,
  });
};

module.exports = errorHandler;

