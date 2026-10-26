const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const parts = authHeader?.split(" ");

  if (
    !parts ||
    parts.length !== 2 ||
    parts[0] !== "Bearer" ||
    !parts[1]
  ) {
    return next(new AppError("Access token is required", 401));
  }

  try {
    const decoded = jwt.verify(
      parts[1],
      process.env.JWT_SECRET
    );

    req.user = decoded;
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
};

module.exports = authenticateToken;