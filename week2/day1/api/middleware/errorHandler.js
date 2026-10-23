const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error("Server error:", err.message);
  }

  return res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message,
  });
};

module.exports = errorHandler;
